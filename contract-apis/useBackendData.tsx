"use client"

import { Tweak } from "@/components/BackendDataTweaker"
import { useToasts } from "@/components/Toasts"
import {
  BackendDataAfterWallet,
  fetchBackendDataAfterWallet,
} from "@/contract-apis/fetchBackendDataAfterWallet"
import { BackendDataBeforeWallet } from "@/contract-apis/fetchBackendDataBeforeWallet"
import { fetchGlobalLockupCapacity } from "@/contract-apis/fetchGlobalLockupCapacity"
import { useChain } from "@cosmos-kit/react"
import merge from "lodash/merge"
import { usePathname, useRouter } from "next/navigation"
import {
  createContext,
  ReactNode,
  useContext,
  useDeferredValue,
  useEffect,
  useMemo,
  useState,
} from "react"

// Declare backendData property on Window interface
declare global {
  interface Window {
    backendDataBeforeWallet?: BackendDataBeforeWallet
    backendDataAfterWallet?: BackendDataAfterWallet
  }
}

export interface BackendDataContextType extends BackendDataAfterWallet {
  isLoading: boolean
  isWalletConnected: boolean
}

const initialBackendDataContext: BackendDataAfterWallet = {
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

const BackendDataContext = createContext<BackendDataAfterWallet>(
  initialBackendDataContext
)

export function BackendDataContextProvider({
  backendDataBeforeWallet,
  children,
}: {
  backendDataBeforeWallet: BackendDataBeforeWallet
  children: ReactNode
}) {
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
  const preMergedBackendData = useMemo(
    () => merge({}, initialBackendDataContext, backendDataBeforeWallet),
    [backendDataBeforeWallet]
  )
  const [backendDataAfterWallet, setBackendDataAfterWallet] =
    useState<BackendDataAfterWallet>(preMergedBackendData)
  const [loadedTweaks, setLoadedTweaks] = useState<Tweak[]>([])
  const mergedTweaks = useMemo(() => {
    return loadedTweaks.reduce((acc, tweak) => {
      return tweak.disabled ? acc : merge(acc, tweak.json)
    }, {})
  }, [loadedTweaks])
  const contextValue = {
    ...backendDataAfterWallet,
    isLoading,
    isWalletConnected,
    ...mergedTweaks,
  }

  useEffect(() => {
    if (!address) {
      setBackendDataAfterWallet(preMergedBackendData)
    }
  }, [address, preMergedBackendData])

  useEffect(() => {
    function checkForTweaks() {
      const tweaks = window.localStorage.getItem("backendDataTweaks") ?? "[]"
      setLoadedTweaks(JSON.parse(tweaks))
    }

    checkForTweaks()

    const timer = setInterval(checkForTweaks, 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_RELOAD_CAP_DATA_INTERVAL_SECONDS) return

    async function queryLockupCapacity() {
      setToasts([
        {
          variant: "workingInBackground",
          message: null,
        },
      ])

      try {
        const globalLockupCapacity = await fetchGlobalLockupCapacity()

        setBackendDataAfterWallet((prev) => ({
          ...prev,
          ...globalLockupCapacity,
        }))
      } catch (error) {
        console.warn("Error fetching lockup capacity", error)
      }

      setToasts([])
    }

    queryLockupCapacity()

    const timer = setInterval(
      queryLockupCapacity,
      1000 * Number(process.env.NEXT_PUBLIC_RELOAD_CAP_DATA_INTERVAL_SECONDS)
    )

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    ;(async () => {
      if (!address) {
        if (process.env.CONTEXT !== "production") {
          window.backendDataBeforeWallet = backendDataBeforeWallet
          console.log({ backendDataBeforeWallet: backendDataBeforeWallet })
        }
        return
      }

      setIsLoading(true)

      const backendDataAfterWallet = await fetchBackendDataAfterWallet({
        address,
        backendDataBeforeWallet,
      })

      const augmentedBackendDataAfterWallet = {
        ...backendDataAfterWallet,
        currentRoundEndDate:
          typeof backendDataAfterWallet.currentRoundEndDate === "string"
            ? new Date(backendDataAfterWallet.currentRoundEndDate)
            : backendDataAfterWallet.currentRoundEndDate,
        lockups: backendDataAfterWallet.lockups.map((lockup) => ({
          ...lockup,
          dateEnd:
            typeof lockup.dateEnd === "string"
              ? new Date(lockup.dateEnd)
              : lockup.dateEnd,
          dateStart:
            typeof lockup.dateStart === "string"
              ? new Date(lockup.dateStart)
              : lockup.dateStart,
        })),
      }

      if (process.env.CONTEXT !== "production") {
        window.backendDataAfterWallet = augmentedBackendDataAfterWallet
        console.log({ backendDataAfterWallet: augmentedBackendDataAfterWallet })
      }

      setBackendDataAfterWallet(augmentedBackendDataAfterWallet)

      setIsLoading(false)
    })()
  }, [address, backendDataBeforeWallet])

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
    <BackendDataContext.Provider value={contextValue}>
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
