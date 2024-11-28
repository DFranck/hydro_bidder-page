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
  bidDescriptionsByBidId: {},
  bidsByRoundId: {},
  isLoading: false,
  isWalletConnected: false,
  preHydroBids: [],
  currentRoundMetadata: {
    roundEnd: new Date(),
    roundId: 0,
    tranches: [],
    votes: [],
    votingPower: 0,
  },
  lockups: {
    count: 0,
    lockups: [],
    totalAtomLocked: 0,
  },
  globalMetadata: {
    atomPrice: 0,
    totalLockedTokens: 0,
    maxLockedTokens: 0,
    metrics: {
      currentRoundPolAvailable: 0,
      currentRoundPolDeployed: 0,
      currentRoundUniqueWallets: 0,
      currentRoundTotalAtomLocked: 0,
      currentRoundUsersAvgTokenLocked: 0,
      currentRoundUsersApr: [],
      allTimeUniqueWallets: 0,
      allTimeTotalAtomLocked: 0,
      allTimeTotalActiveRounds: 0,
      allTimeUsersAvgActiveRounds: 0,
      allTimeUsersAvgTokenLocked: 0,
      allTimeUsersRewards: 0,
      allTimeUsersApr: [],
      allTimeApr: [],
    },
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

  console.log(contextValue.globalMetadata.atomPrice)

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
    throw new Error("useContractContext must be used within a ContractProvider")
  }

  return context
}
