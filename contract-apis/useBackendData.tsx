"use client"

import { useToasts } from "@/components/Toasts"
import {
  BackendDataWithWallet,
  fetchBackendDataWithWallet,
} from "@/contract-apis/fetchBackendDataWithWallet"
import { BackendData } from "@/contract-apis/fetchBackendDataWithoutWallet"
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

export interface BackendDataContextType extends BackendDataWithWallet {
  isLoading: boolean
  isWalletConnected: boolean
}

const initialBackendDataContext: BackendDataWithWallet = {
  address: "",
  atomPrice: 0,
  bidDescriptionsByBidId: {},
  bidsByRoundId: {},
  currentRoundEnd: 0,
  currentRoundId: 0,
  currentRoundTranches: [],
  isLoading: false,
  isWalletConnected: false,
  lockupEpochLength: 0,
  lockups: [],
  maxLockedAtomGlobal: 0,
  maxLockedAtomUser: 0,
  metricsForPostHydroBids: [],
  metricsForPreHydroBids: [],
  totalLockedAtomGlobal: 0,
  totalLockedAtomUser: 0,
  votes: [],
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

const BackendDataContext = createContext<BackendDataWithWallet>(
  initialBackendDataContext
)

export function BackendDataContextProvider({
  backendData,
  children,
}: {
  backendData: BackendData
  children: ReactNode
}) {
  const { address, isWalletConnected, isWalletConnecting } = useChain("neutron")
  const wasWalletConnected = useDeferredValue(isWalletConnected)
  const pathname = usePathname()
  const router = useRouter()
  const { setToasts } = useToasts()
  const [isLoading, setIsLoading] = useState(false)
  const [backendDataWithWallet, setBackendDataWithWallet] =
    useState<BackendDataWithWallet>(
      merge({}, initialBackendDataContext, backendData)
    )
  const contextValue = {
    ...backendDataWithWallet,
    isLoading,
    isWalletConnected,
  }

  useEffect(() => {
    ;(async () => {
      if (!address) return
      setIsLoading(true)
      setToasts([
        {
          message: "Loading...",
          variant: "working",
        },
      ])

      const backendDataWithWallet = await fetchBackendDataWithWallet({
        address,
        backendData,
      })

      setBackendDataWithWallet(backendDataWithWallet)
      setToasts([])
      setIsLoading(false)
    })()
  }, [address, backendData])

  useEffect(() => {
    if (isWalletConnecting) return

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
  }, [
    isWalletConnected,
    isWalletConnecting,
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
