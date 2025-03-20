"use client"

import { augmentBackendDataAfterWallet } from "@/contract-apis/augmentBackendDataAfterWallet"
import { augmentBackendDataBeforeWallet } from "@/contract-apis/augmentBackendDataBeforeWallet"
import { fetchWalletData } from "@/contract-apis/fetchWalletData"
import {
  AugmentedBackendDataAfterWallet,
  BackendDataBeforeWalletSlimmed,
} from "@/contract-apis/types"
import { mergeWithOverwrite } from "@/lib/mergeWithOverwrite"
import { useChain } from "@cosmos-kit/react"
import merge from "lodash/merge"
import { usePathname, useRouter } from "next/navigation"
import {
  createContext,
  ReactNode,
  useContext,
  useDeferredValue,
  useEffect,
  useState,
} from "react"
import { BackendDataTweak } from "./types"

// Declare backendData property on Window interface
declare global {
  interface Window {
    debugData?: object
  }
}

export interface BackendDataContextType
  extends AugmentedBackendDataAfterWallet {
  isLoading: boolean
  isWalletConnected: boolean
  refetchBackendData: () => void
}

const initialBackendDataContext: BackendDataContextType = {
  address: "",
  assetListWithPrices: {},
  atomPrice: 0,
  bidsInfo: {},
  bidMetaDataById: {},
  bidsById: {},
  claimsHistorical: [],
  claimsOutstanding: [],
  currentRoundEndDate: new Date(),
  currentRoundId: 0,
  currentRoundIsPilot: false,
  tranches: [],
  isLoading: false,
  isWalletConnected: false,
  lockedAtomEpochInNanos: 0,
  lockedAtomIsAtCapacityGlobal: false,
  lockedAtomIsAtCapacityWallet: false,
  lockedAtomMaxGlobal: 0,
  lockedAtomMaxWallet: 0,
  lockedAtomPercentageGlobal: 0,
  lockedAtomPercentageWallet: 0,
  lockedAtomRemainingCapacityGlobal: 0,
  lockedAtomTotalGlobal: 0,
  lockedAtomTotalWallet: 0,
  lockups: [],
  metricsForPostHydroBids: [],
  metricsForPreHydroBids: [],
  minTributeFactor: 0,
  votes: [],
  votesByRoundId: {},
  votingPowerAvailable: 0,
  votingPowerSpent: 0,
  votingPowerTotal: 0,
  metricsGlobal: {
    allTimePolApr: 0,
    allTimePolDeployed: 0,
    allTimePolRevenue: 0,
    allTimePolYield: 0,
    allTimeTotalActiveRounds: 0,
    allTimeTotalAtomLocked: 0,
    allTimeTributeApr: 0,
    allTimeTributeYield: 0,
    allTimeUniqueWallets: 0,
    allTimeUsersAvgRoundsLocked: 0,
    allTimeUsersAvgTokensLocked: 0,
    currentPolAvailable: 0,
    currentPolDeployed: 0,
    currentPolDeploymentCap: 0,
    currentPolTotal: 0,
    currentTotalAtomLocked: 0,
    currentTributeApr: 0,
    currentTributeYield: 0,
    currentUniqueWallets: 0,
    currentUsersAvgRoundsLocked: 0,
    currentUsersAvgTokensLocked: 0,
  },
  refetchBackendData: () => {},
}

const BackendDataContext = createContext<BackendDataContextType>(
  initialBackendDataContext
)

export function BackendDataContextProvider({
  rawBackendDataBeforeWallet,
  children,
}: {
  rawBackendDataBeforeWallet: BackendDataBeforeWalletSlimmed
  children: ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [loadedTweaks, setLoadedTweaks] = useState<BackendDataTweak[]>([])
  const [state, setState] = useState<AugmentedBackendDataAfterWallet>(
    initialBackendDataContext
  )
  const {
    address,
    isWalletConnected,
    isWalletConnecting,
    isWalletDisconnected,
  } = useChain("neutron")
  const isWalletForceConnected = Boolean(
    loadedTweaks
      .filter((tweak) => !tweak.disabled)
      .find((tweak) => tweak.json.patchData?.isWalletConnected)
  )
  const isWalletConnectedOrForceConnected =
    isWalletConnected || isWalletForceConnected
  const wasWalletConnected = useDeferredValue(isWalletConnectedOrForceConnected)

  // Dependencies: [address, loadedTweaks, rawBackendDataBeforeWallet]
  useEffect(() => {
    const enabledTweaks: BackendDataTweak["json"] = merge(
      {},
      ...loadedTweaks
        .filter((tweak) => !tweak.disabled)
        .map((tweak) => tweak.json)
    )

    const { patchData = {} } = enabledTweaks
    const {
      hydroMetaData,
      hydroRoundData,
      externalData,
      walletData: walletDataTweaks,
      $hydroMetaData,
      $hydroRoundData,
      $externalData,
      $walletData,
    } = enabledTweaks
    const tweakedRawBackendDataBeforeWallet = mergeWithOverwrite(
      {},
      rawBackendDataBeforeWallet,
      {
        ...(hydroMetaData !== undefined && { hydroMetaData }),
        ...(hydroRoundData !== undefined && { hydroRoundData }),
        ...(externalData !== undefined && { externalData }),
        ...($hydroMetaData !== undefined && { $hydroMetaData }),
        ...($hydroRoundData !== undefined && { $hydroRoundData }),
        ...($externalData !== undefined && { $externalData }),
      }
    )

    const augmentedBackendDataBeforeWallet = augmentBackendDataBeforeWallet(
      tweakedRawBackendDataBeforeWallet
    )

    const effectiveAddress = patchData?.address ?? address

    if (!effectiveAddress) {
      const finalState = mergeWithOverwrite(
        {},
        initialBackendDataContext,
        augmentedBackendDataBeforeWallet,
        patchData
      )

      logDebugData([
        { enabledTweaks },
        { rawBackendDataBeforeWallet },
        { tweakedRawBackendDataBeforeWallet },
        { augmentedBackendDataBeforeWallet },
        { finalState },
      ])

      setState(finalState)
      return
    }

    const { currentRoundId, tranches } = augmentedBackendDataBeforeWallet

    ;(async () => {
      setIsLoading(true)

      const walletData = await fetchWalletData({
        address: effectiveAddress,
        currentRoundId,
        tranches,
      })

      const tweakedWalletData = mergeWithOverwrite(
        {},
        walletData,
        walletDataTweaks ?? {}
      )

      const augmentedBackendDataAfterWallet = augmentBackendDataAfterWallet({
        address: effectiveAddress,
        augmentedBackendDataBeforeWallet,
        walletData: tweakedWalletData,
      })

      const tweakedAugmentedBackendDataAfterWallet = mergeWithOverwrite(
        {},
        augmentedBackendDataAfterWallet,
        patchData
      )

      logDebugData([
        { enabledTweaks },
        { rawBackendDataBeforeWallet },
        { tweakedRawBackendDataBeforeWallet },
        { augmentedBackendDataBeforeWallet },
        { walletData },
        { tweakedWalletData },
        { augmentedBackendDataAfterWallet },
        { tweakedAugmentedBackendDataAfterWallet },
        { finalState: tweakedAugmentedBackendDataAfterWallet },
      ])

      setState(tweakedAugmentedBackendDataAfterWallet)

      setIsLoading(false)
    })()
  }, [address, loadedTweaks, rawBackendDataBeforeWallet])

  useEffect(() => {
    refetchBackendData()
  }, [])

  // TODO: Add a timer to reload the data every 30 seconds (see env variable)

  useEffect(() => {
    if (isWalletConnecting || isWalletDisconnected) return
    ;(async () => {
      const protectedRoutes = ["/rewards", "/lockups", "/lock-atom"]
      const didJustConnect =
        !wasWalletConnected && isWalletConnectedOrForceConnected
      const didJustDisconnect =
        wasWalletConnected && !isWalletConnectedOrForceConnected
      const hasBeenRedirected =
        window.sessionStorage.getItem("redirected") === "true"
      const isProtectedRoute =
        pathname &&
        protectedRoutes.some((protectedRoute) =>
          pathname?.startsWith(protectedRoute)
        )

      // Redirect to bids if user has just connected their wallet and is on homepage
      if (didJustConnect && !hasBeenRedirected && pathname === "/") {
        window.sessionStorage.setItem("redirected", "true")
        router.push("/bids")
      }

      // Redirect to bids if user disconnects while on protected routes
      if (
        (didJustDisconnect || !isWalletConnectedOrForceConnected) &&
        isProtectedRoute
      ) {
        router.push("/bids")
      }
    })()
  }, [
    isWalletConnectedOrForceConnected,
    isWalletConnecting,
    isWalletDisconnected,
    pathname,
    router,
    wasWalletConnected,
  ])

  function refetchBackendData() {
    const tweaks = window.localStorage.getItem("backendDataTweaks") ?? "[]"
    setLoadedTweaks(JSON.parse(tweaks))
  }

  function logDebugData(debugData: object[]) {
    if (process.env.CONTEXT === "production") return
    window.debugData = debugData

    console.groupCollapsed(`[ 🐜 Debug Data ]`)
    debugData.forEach((data) => {
      const [[key, value]] = Object.entries(data)
      console.groupCollapsed(key)
      if (Array.isArray(value)) {
        value.forEach((item) => {
          console.log(item)
        })
      } else if (typeof value === "object" && value !== null) {
        Object.entries(value).forEach(([key, value]) => {
          console.log(`${key}:`, value)
        })
      } else {
        console.log(value)
      }
      console.groupEnd()
    })
    console.groupEnd()

    const { finalState } = debugData[debugData.length - 1] as {
      finalState: AugmentedBackendDataAfterWallet
    }

    console.log("💡 You have access to the `debugData` object in the console!")
    console.log(
      `🖪 Debug Data Size: ${(JSON.stringify(debugData).length / 1024 / 1024).toFixed(2)} MB`
    )
    console.log(
      `🖪 State Size: ${(JSON.stringify(finalState).length / 1024 / 1024).toFixed(2)} MB`
    )
  }

  return (
    <BackendDataContext.Provider
      value={{
        ...state,
        isLoading,
        isWalletConnected: isWalletConnectedOrForceConnected,
        refetchBackendData,
      }}
    >
      {children}
    </BackendDataContext.Provider>
  )
}

export function useBackendData() {
  const context = useContext(BackendDataContext)

  if (context === undefined) {
    throw new Error(
      "useBackendData must be used within a BackendDataContext Provider"
    )
  }

  return context
}
