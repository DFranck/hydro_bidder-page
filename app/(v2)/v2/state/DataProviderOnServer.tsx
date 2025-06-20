import { Tranche } from '@/app/ts_types/HydroBase.types'
import { BidMetaData, BidRevampMetrics } from '@/contract-apis/types'
import { SourceID } from '@v2/environments'
import { Suspense } from 'react'
import { DataProviderOnClient } from './DataProviderOnClient'

export interface RoundState {
  sourceId: SourceID
  currentRoundId: number
  roundEnd: string
  tranches: Tranche[]
  augmentedBids: BidRevampMetrics[]
  totalLockedTokens: number
}

export interface AppState {
  narrowBuckets: boolean
  currentRoundDataPerSource: Record<SourceID, RoundState> | null
  bidDescriptionsById: Record<number, BidMetaData>
  activeTrancheIndex: number
  isSidebarOpen: boolean
  isLoading: boolean
}

export const initialState: AppState = {
  bidDescriptionsById: {},
  currentRoundDataPerSource: null,
  narrowBuckets: false,
  activeTrancheIndex: 0,
  isSidebarOpen: true,
  isLoading: false,
}

interface DataPromises {
  hydroDataPromise: Promise<
    Array<{
      sourceId: SourceID
      data: {
        constants: any
        totalLockedTokens: number
        currentRound: any
        tranches: Tranche[]
        augmentedBids: BidRevampMetrics[]
      }
    }>
  >
  bidDescriptionsPromise: Promise<Record<number, BidMetaData>>
}

async function DataLoader({
  children,
  dataPromises,
}: {
  children: React.ReactNode
  dataPromises: DataPromises
}) {
  const [hydroData, bidDescriptions] = await Promise.all([
    dataPromises.hydroDataPromise,
    dataPromises.bidDescriptionsPromise,
  ])

  return (
    <DataProviderOnClient
      hydroData={hydroData}
      bidDescriptions={bidDescriptions}
    >
      {children}
    </DataProviderOnClient>
  )
}

export function DataProviderOnServer({
  children,
  dataPromises,
}: {
  children: React.ReactNode
  dataPromises: DataPromises
}) {
  return (
    <Suspense
      fallback={
        <DataProviderOnClient hydroData={null} bidDescriptions={{}}>
          {children}
        </DataProviderOnClient>
      }
    >
      <DataLoader dataPromises={dataPromises}>{children}</DataLoader>
    </Suspense>
  )
}
