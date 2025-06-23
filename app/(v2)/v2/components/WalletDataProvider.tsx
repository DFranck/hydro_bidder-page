'use client'

import { useChain } from '@cosmos-kit/react'
import { useWalletData } from '@v2/hooks'
import { DataProviderOnClient } from '@v2/state/DataProviderOnClient'
import { useEffect, useMemo, useState } from 'react'

interface WalletDataProviderProps {
  children: React.ReactNode
  initialDataPromises: {
    hydroDataPromise: Promise<
      Array<{
        sourceId: string
        data: {
          constants: any
          totalLockedTokens: number
          currentRound: any
          tranches: any[]
          augmentedBids: any[]
          walletData?: any
        }
      }>
    >
    bidDescriptionsPromise: Promise<Record<number, any>>
  }
}

export function WalletDataProvider({
  children,
  initialDataPromises,
}: WalletDataProviderProps) {
  const { address, isWalletConnected } = useChain('neutron')
  const [hydroData, setHydroData] = useState<any[] | null>(null)
  const [bidDescriptions, setBidDescriptions] = useState<Record<number, any>>(
    {},
  )

  // Use the optimized wallet data hook
  const { walletData: walletDataResults, isLoading: isWalletDataLoading } =
    useWalletData(isWalletConnected && address ? address : null)

  // Resolve initial data promises
  useEffect(() => {
    const resolveInitialData = async () => {
      try {
        const [hydroDataResult, bidDescriptionsResult] = await Promise.all([
          initialDataPromises.hydroDataPromise,
          initialDataPromises.bidDescriptionsPromise,
        ])

        setHydroData(hydroDataResult)
        setBidDescriptions(bidDescriptionsResult)
      } catch (error) {
        console.error(
          'WalletDataProvider: Failed to resolve initial data:',
          error,
        )
      }
    }

    resolveInitialData()
  }, [initialDataPromises])

  // Merge wallet data with hydro data when wallet data is available
  const mergedHydroData = useMemo(() => {
    if (!hydroData) {
      return null
    }

    return hydroData.map((sourceData) => {
      const walletDataForSource = walletDataResults?.find(
        (wd) => wd.sourceId === sourceData.sourceId,
      )
      return {
        ...sourceData,
        data: {
          ...sourceData.data,
          walletData: walletDataForSource?.walletData ?? null,
        },
      }
    })
  }, [hydroData, walletDataResults])

  return (
    <DataProviderOnClient
      hydroData={mergedHydroData}
      bidDescriptions={bidDescriptions}
    >
      {children}
    </DataProviderOnClient>
  )
}
