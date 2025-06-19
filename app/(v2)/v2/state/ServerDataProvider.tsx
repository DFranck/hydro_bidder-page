import { Tranche } from '@/app/ts_types/HydroBase.types'
import { BidMetaData, BidRevampMetrics } from '@/contract-apis/types'
import { SourceID } from '@v2/environments'
import { Suspense } from 'react'
import { ClientDataProvider } from './ClientDataProvider'

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
}

export const initialState: AppState = {
  bidDescriptionsById: {},
  currentRoundDataPerSource: null,
  narrowBuckets: false,
  activeTrancheIndex: 0,
  isSidebarOpen: true,
}

export function ServerDataProvider({
  children,
  hydroData,
  bidDescriptions,
}: {
  children: React.ReactNode
  hydroData: Array<{
    sourceId: SourceID
    data: {
      constants: any
      totalLockedTokens: number
      currentRound: any
      tranches: Tranche[]
      augmentedBids: BidRevampMetrics[]
    }
  }> | null
  bidDescriptions: Record<number, BidMetaData>
}) {
  return (
    <Suspense
      fallback={
        <>
          {/* Render the header and sidebar with initial state */}
          <ClientDataProvider hydroData={null} bidDescriptions={{}}>
            {children}
          </ClientDataProvider>
        </>
      }
    >
      <ClientDataProvider
        hydroData={hydroData}
        bidDescriptions={bidDescriptions}
      >
        {children}
      </ClientDataProvider>
    </Suspense>
  )
}
