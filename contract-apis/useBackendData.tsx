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
  bidsByRoundId: new Map(),
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
    assetListWithPrices: new Map(),
    atomPrice: 0,
    totalLockedTokens: 0,
    maxLockedTokens: 0,
    metrics: [],
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
    <BackendDataContext.Provider
      value={{ ...backendDataWithAddress, isLoading, isWalletConnected }}
    >
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
