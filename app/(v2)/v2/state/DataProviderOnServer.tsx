import { AppState, AugmentedTranche, DataPromises, RoundState } from '@v2/types'
import { Suspense } from 'react'
import { DataProviderOnClient } from './DataProviderOnClient'

export type { AppState, AugmentedTranche, RoundState }

export const initialState: AppState = {
  bidDescriptionsById: {},
  currentRoundDataPerSource: null,
  narrowBuckets: false,
  activeTrancheIndex: 0,
  isSidebarOpen: false,
  isLoading: false,
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
