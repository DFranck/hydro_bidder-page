"use client"

import {
  BackendDataAfterWallet,
  fetchBackendDataAfterWallet,
} from "@/contract-apis/fetchBackendDataAfterWallet"
import { BackendDataBeforeWallet } from "@/contract-apis/fetchBackendDataBeforeWallet"
import { useChain } from "@cosmos-kit/react"
import { merge } from "lodash"
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

export interface BackendDataContextType extends BackendDataAfterWallet {
  isLoading: boolean
  isWalletConnected: boolean
}

const initialBackendDataContext: BackendDataAfterWallet = {
  address: "",
  assetListWithPrices: new Map(),
  atomPrice: 0,
  bidDescriptionsByBidId: {},
  bids: [],
  bidsById: {},
  bidsByRoundId: {},
  claims: [],
  claimsOutstanding: [],
  currentRoundEndDate: new Date(),
  currentRoundId: 0,
  currentRoundIsPilot: false,
  currentRoundTranches: [],
  isLoading: false,
  isWalletConnected: false,
  lockedAtomIsAtGlobalCapacity: false,
  lockedAtomIsAtWalletCapacity: false,
  lockedAtomMaxGlobal: 0,
  lockedAtomMaxWallet: 0,
  lockedAtomPercentageGlobal: 0,
  lockedAtomPercentageWallet: 0,
  lockedAtomTotalGlobal: 0,
  lockedAtomTotalWallet: 0,
  lockupEpochLength: 0,
  lockups: [],
  metricsForPostHydroBids: [],
  metricsForPreHydroBids: [],
  votes: [],
  votesByRoundId: {},
  votingPower: 0,
  metricsGlobal: {
    allTimeApr: [],
    allTimeTotalActiveRounds: 0,
    allTimeTotalAtomLocked: 0,
    allTimeUniqueWallets: 0,
    allTimeUsersApr: [],
    allTimeUsersAvgActiveRounds: 0,
    allTimeUsersAvgTokenLocked: 0,
    allTimeUsersRewards: 0,
    currentRoundPolAvailable: 0,
    currentRoundPolDeployed: 0,
    currentRoundTotalAtomLocked: 0,
    currentRoundUniqueWallets: 0,
    currentRoundUsersApr: [],
    currentRoundUsersAvgTokenLocked: 0,
  },
}

const BackendDataContext = createContext<BackendDataAfterWallet>(
  initialBackendDataContext
)

export function BackendDataContextProvider({
  backendData,
  children,
}: {
  backendData: BackendDataBeforeWallet
  children: ReactNode
}) {
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
    () => merge({}, initialBackendDataContext, backendData),
    [backendData]
  )
  const [backendDataAfterWallet, setBackendDataAfterWallet] =
    useState<BackendDataAfterWallet>(preMergedBackendData)
  const contextValue = {
    ...backendDataAfterWallet,
    isLoading,
    isWalletConnected,
  }

  useEffect(() => {
    if (!address) {
      setBackendDataAfterWallet(preMergedBackendData)
    }
  }, [address, preMergedBackendData])

  useEffect(() => {
    ;(async () => {
      if (!address) return

      setIsLoading(true)

      const backendDataAfterWallet = await fetchBackendDataAfterWallet({
        address,
        backendData,
      })

      setBackendDataAfterWallet({
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
      })

      setIsLoading(false)
    })()
  }, [address, backendData])

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
          pathname.startsWith(protectedRoute)
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
