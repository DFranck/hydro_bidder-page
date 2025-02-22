"use client"

import { Tweak } from "@/components/BackendDataTweaker"
import { useToasts } from "@/components/Toasts"
import { augmentBackendDataAfterWallet } from "@/contract-apis/augmentBackendDataAfterWallet"
import { augmentBackendDataBeforeWallet } from "@/contract-apis/augmentBackendDataBeforeWallet"
import { fetchWalletData } from "@/contract-apis/fetchWalletData"
import {
  AugmentedBackendDataAfterWallet,
  AugmentedBackendDataBeforeWallet,
  RawBackendDataBeforeWallet,
} from "@/contract-apis/types"
import { useChain } from "@cosmos-kit/react"
import { merge } from "lodash"
import { usePathname, useRouter } from "next/navigation"
import {
  createContext,
  ReactNode,
  useContext,
  useDeferredValue,
  useEffect,
  useState,
} from "react"

// Declare backendData property on Window interface
declare global {
  interface Window {
    finalState?:
      | AugmentedBackendDataBeforeWallet
      | AugmentedBackendDataAfterWallet
  }
}

export interface BackendDataContextType
  extends AugmentedBackendDataAfterWallet {
  isLoading: boolean
  isWalletConnected: boolean
}

const initialBackendDataAfterWallet: AugmentedBackendDataAfterWallet = {
  address: "",
  assetListWithPrices: {},
  atomPrice: 0,
  bidDescriptionsByBidId: {},
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
}

const BackendDataContext = createContext<AugmentedBackendDataAfterWallet>(
  initialBackendDataAfterWallet
)

export function BackendDataContextProvider({
  rawBackendDataBeforeWallet,
  children,
}: {
  rawBackendDataBeforeWallet: RawBackendDataBeforeWallet
  children: ReactNode
}) {
  const [state, setState] = useState<AugmentedBackendDataAfterWallet>(
    initialBackendDataAfterWallet
  )
  const { setToasts } = useToasts()
  const {
    address,
    isWalletConnected,
    isWalletConnecting,
    isWalletDisconnected,
  } = useChain("neutron")
  const wasWalletConnected = useDeferredValue(isWalletConnected)
  const pathname = usePathname()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [loadedTweaks, setLoadedTweaks] = useState<Tweak[]>([])

  // Wallet connected? Fetch data!
  useEffect(() => {
    console.log("Fetching!")

    const augmentedBackendDataBeforeWallet = augmentBackendDataBeforeWallet(
      rawBackendDataBeforeWallet
    )

    console.log({ augmentedBackendDataBeforeWallet })

    if (!address) {
      const finalState = merge(
        initialBackendDataAfterWallet,
        augmentedBackendDataBeforeWallet
      )

      if (process.env.CONTEXT !== "production") {
        window.finalState = finalState
        console.log({ finalState: window.finalState })
      }

      setState(finalState)
      return
    }

    const { currentRoundId, tranches } = augmentedBackendDataBeforeWallet

    ;(async () => {
      setIsLoading(true)

      const walletData = await fetchWalletData({
        address,
        currentRoundId,
        tranches,
      })

      const augmentedBackendDataAfterWallet = augmentBackendDataAfterWallet({
        address,
        augmentedBackendDataBeforeWallet,
        walletData,
      })

      if (process.env.CONTEXT !== "production") {
        window.finalState = augmentedBackendDataAfterWallet
        console.log({ finalState: window.finalState })
      }

      setState(augmentedBackendDataAfterWallet)

      setIsLoading(false)
    })()
  }, [address, rawBackendDataBeforeWallet])

  useEffect(() => {
    if (!address) {
      setState(initialBackendDataAfterWallet)
    }
  }, [address])

  useEffect(() => {
    function checkForTweaks() {
      const tweaks = window.localStorage.getItem("backendDataTweaks") ?? "[]"
      setLoadedTweaks(JSON.parse(tweaks))
    }

    checkForTweaks()

    const timer = setInterval(checkForTweaks, 1000)
    return () => clearInterval(timer)
  }, [])

  // TODO: Add a timer to reload the data every 30 seconds (see env variable)

  useEffect(() => {
    if (isWalletConnecting || isWalletDisconnected) return
    ;(async () => {
      const protectedRoutes = ["/rewards", "/lockups", "/lock-atom"]
      const didJustConnect = !wasWalletConnected && isWalletConnected
      const didJustDisconnect = wasWalletConnected && !isWalletConnected
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
      if ((didJustDisconnect || !isWalletConnected) && isProtectedRoute) {
        router.push("/bids")
      }
    })()
  }, [
    isWalletConnected,
    isWalletConnecting,
    isWalletDisconnected,
    pathname,
    router,
    wasWalletConnected,
  ])

  return (
    <BackendDataContext.Provider
      value={{
        ...state,
        isLoading,
        isWalletConnected,
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
