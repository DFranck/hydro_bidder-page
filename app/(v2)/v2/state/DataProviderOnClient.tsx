'use client'

import { Tranche } from '@/app/ts_types/HydroBase.types'
import { BidMetaData, BidRevampMetrics } from '@/contract-apis/types'
import { SourceID } from '@v2/environments'
import { usePathname } from 'next/navigation'
import { createContext, useContext, useEffect, useReducer, useRef } from 'react'
import { AppState, initialState } from './DataProviderOnServer'
import { AppAction, reducer } from './reducer'

export const AppContext = createContext<{
  state: AppState
  dispatch: React.Dispatch<AppAction>
}>({
  state: initialState,
  dispatch: () => {},
})

interface DataProviderOnClientProps {
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
}: DataProviderOnClientProps) {
  const pathname = usePathname()
  const previousPathnameRef = useRef(pathname)

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
    isLoading: hydroData === null,
  }

  const [state, dispatch] = useReducer(reducer, initialStateWithData)

  // Update loading state when data changes
  useEffect(() => {
    dispatch({ type: 'SET_IS_LOADING', payload: hydroData === null })
  }, [hydroData])

  // Watch for pathname changes to clear loading state when navigation completes
  useEffect(() => {
    if (state.isLoading && pathname !== previousPathnameRef.current) {
      // Pathname has changed, navigation completed
      dispatch({ type: 'SET_IS_LOADING', payload: false })
    }
    previousPathnameRef.current = pathname
  }, [pathname, state.isLoading])

  console.log(JSON.stringify(state).length, 'bytes', { state })

  return <AppContext value={{ state, dispatch }}>{children}</AppContext>
}

export function useAppState() {
  return useContext(AppContext)
}
