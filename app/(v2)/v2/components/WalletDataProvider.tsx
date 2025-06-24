'use client'

import { useChain } from '@cosmos-kit/react'
import { useWalletData } from '@v2/hooks'
import { DataProviderOnClient } from '@v2/state/DataProviderOnClient'
import { DataPromises } from '@v2/types'
import { useEffect, useMemo, useState } from 'react'

interface WalletDataProviderProps {
  children: React.ReactNode
  initialDataPromises: DataPromises
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

  const { walletData: walletDataResults, isLoading: isWalletDataLoading } =
    useWalletData(isWalletConnected && address ? address : null)

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

  const walletDataBySourceId = useMemo(() => {
    if (!isWalletConnected || !walletDataResults) {
      return new Map()
    }
    return new Map(walletDataResults.map((wd) => [wd.sourceId, wd.walletData]))
  }, [isWalletConnected, walletDataResults])

  const mergedHydroData = useMemo(() => {
    if (!hydroData) {
      return null
    }

    const result = hydroData.map((sourceData) => {
      const walletDataForSource =
        walletDataBySourceId.get(sourceData.sourceId) ?? null

      return {
        ...sourceData,
        data: {
          ...sourceData.data,
          walletData: walletDataForSource,
        },
      }
    })

    return result
  }, [hydroData, walletDataBySourceId, isWalletConnected, walletDataResults])

  return (
    <DataProviderOnClient
      hydroData={mergedHydroData}
      bidDescriptions={bidDescriptions}
      isWalletDataLoading={isWalletDataLoading}
    >
      {children}
    </DataProviderOnClient>
  )
}
