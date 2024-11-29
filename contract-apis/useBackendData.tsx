"use client"

import { useToasts } from "@/components/Toasts"
import {
  BackendDataWithAddress,
  fetchBackendDataWithAddress,
} from "@/contract-apis/fetchBackendDataWithAddress"
import { BackendData } from "@/contract-apis/fetchBackendDataWithoutAddress"
import { useChain } from "@cosmos-kit/react"
import { merge } from "lodash"
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react"

export interface BackendDataContextType extends BackendDataWithAddress {
  isLoading: boolean
  isWalletConnected: boolean
}

const initialBackendDataContext: BackendDataWithAddress = {
  address: "",
  atomPrice: 0,
  bidDescriptionsByBidId: {},
  bidsByRoundId: {},
  currentRoundEnd: new Date(),
  currentRoundId: 0,
  currentRoundTranches: [],
  isLoading: false,
  isWalletConnected: false,
  maxLockedAtomGlobal: 0,
  maxLockedAtomUser: 0,
  metricsForPostHydroBids: [],
  metricsForPreHydroBids: [],
  totalLockedAtomGlobal: 0,
  totalLockedAtomUser: 0,
  usersLockups: [],
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

const BackendDataContext = createContext<BackendDataWithAddress>(
  initialBackendDataContext
)

export function BackendDataContextProvider({
  backendData,
  children,
}: {
  backendData: BackendData
  children: ReactNode
}) {
  const { address, isWalletConnected } = useChain("neutron")
  const { setToasts } = useToasts()
  const [isLoading, setIsLoading] = useState(false)
  const [backendDataWithAddress, setBackendDataWithAddress] =
    useState<BackendDataWithAddress>(
      merge({}, initialBackendDataContext, backendData)
    )
  const contextValue = {
    ...backendDataWithAddress,
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

      const backendDataWithAddress = await fetchBackendDataWithAddress({
        address,
        backendData,
      })

      setBackendDataWithAddress(backendDataWithAddress)
      setToasts([])
      setIsLoading(false)
    })()
  }, [address, backendData])

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
