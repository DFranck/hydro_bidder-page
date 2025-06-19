'use client'

import { Tranche } from '@/app/ts_types/HydroBase.types'
import { BidMetaData, BidRevampMetrics } from '@/contract-apis/types'
import { SourceID } from '@v2/environments'
import { createContext, useContext, useReducer } from 'react'
import { AppState, initialState } from './DataProviderOnServer'
import { AppAction, reducer } from './reducer'

export const AppContext = createContext<{
  state: AppState
  dispatch: React.Dispatch<AppAction>
}>({
  state: initialState,
  dispatch: () => {},
})

interface ClientDataProviderProps {
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
}

export function DataProviderOnClient({
  children,
  hydroData,
  bidDescriptions,
}: ClientDataProviderProps) {
  const initialStateWithData = {
    ...initialState,
    bidDescriptionsById: bidDescriptions,
    currentRoundDataPerSource: hydroData
      ? (Object.fromEntries(
          hydroData.map(({ sourceId, data }) => [
            sourceId,
            {
              sourceId,
              currentRoundId: data.currentRound?.round_id ?? 0,
              roundEnd: data.currentRound?.round_end ?? '',
              tranches: data.tranches ?? [],
              augmentedBids: data.augmentedBids ?? [],
              totalLockedTokens: data.totalLockedTokens ?? 0,
            },
          ]),
        ) as Record<SourceID, any>)
      : null,
  }

  const [state, dispatch] = useReducer(reducer, initialStateWithData)

  console.log(JSON.stringify(state).length, 'bytes', { state })

  return <AppContext value={{ state, dispatch }}>{children}</AppContext>
}

export function useAppState() {
  return useContext(AppContext)
}
