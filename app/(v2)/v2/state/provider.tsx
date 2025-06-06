"use client"

import { SourceID } from "@/app/(v2)/v2/environments"
import { Tranche } from "@/app/ts_types/HydroBase.types"
import {
  BidMetaData,
  BidRevampMetrics,
  RawHydroRoundData,
} from "@/contract-apis/types"
import { createContext, Dispatch, ReactNode, use, useReducer } from "react"
import { AppAction, reducer } from "./reducer"

export interface HydroState {
  sourceId: SourceID
  currentRoundId: number
  roundEnd: string
  tranches: Tranche[]
  roundData: RawHydroRoundData[]
  totalLockedTokens: number
}

export interface AppState {
  narrowBuckets: boolean
  hydroStates: Record<string, HydroState>
  bidDescriptionsById: Record<number, BidMetaData>
}

export const initialState: AppState = {
  bidDescriptionsById: {},
  hydroStates: {},
  narrowBuckets: false,
}

export const AppContext = createContext<{
  state: AppState
  dispatch: Dispatch<AppAction>
}>({
  state: initialState,
  dispatch: () => {},
})

export function AppContextProvider({
  children,
  hydroDataPromise,
  bidDescriptionsByIdPromise,
}: {
  children: ReactNode
  hydroDataPromise: Promise<
    {
      sourceId: SourceID
      data: {
        constants: any
        total_locked_tokens: any
        current_round: any
        tranches: Tranche[]
        round_data: RawHydroRoundData[]
        bids_info: Record<string, BidRevampMetrics>
      }
    }[]
  >
  bidDescriptionsByIdPromise: Promise<Record<number, BidMetaData>>
}) {
  const hydroData = use(hydroDataPromise)
  const bidDescriptionsById = use(bidDescriptionsByIdPromise)
  const initialStateWithData: AppState = {
    ...initialState,
    bidDescriptionsById,
    hydroStates: hydroData
      ? Object.fromEntries(
          hydroData.map(({ sourceId, data }) => [
            sourceId,
            {
              sourceId,
              currentRoundId: data.current_round?.round_id ?? 0,
              roundEnd: data.current_round?.round_end ?? "",
              tranches: data.tranches ?? [],
              roundData: data.round_data ?? [],
              totalLockedTokens: data.total_locked_tokens?.total ?? 0,
              bidsInfo: data.bids_info ?? {},
            },
          ])
        )
      : {},
  }

  const [state, dispatch] = useReducer(reducer, initialStateWithData)

  console.log("state", state)

  return <AppContext value={{ state, dispatch }}>{children}</AppContext>
}

export function useAppState() {
  return use(AppContext)
}
