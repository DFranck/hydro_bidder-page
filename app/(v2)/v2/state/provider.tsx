"use client"

import { SourceID } from "@/app/(v2)/v2/environments"
import { Tranche } from "@/app/ts_types/HydroBase.types"
import { BidMetaData, BidRevampMetrics } from "@/contract-apis/types"
import { createContext, use, useContext, useReducer } from "react"
import { AppAction, reducer } from "./reducer"

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
  isSidebarOpen: boolean
}

export const initialState: AppState = {
  bidDescriptionsById: {},
  currentRoundDataPerSource: null,
  narrowBuckets: false,
  isSidebarOpen: true,
}

export const AppContext = createContext<{
  state: AppState
  dispatch: React.Dispatch<AppAction>
}>({
  state: initialState,
  dispatch: () => {},
})

export function AppContextProvider({
  children,
  hydroDataPromise,
}: {
  children: React.ReactNode
  hydroDataPromise: Promise<
    {
      sourceId: SourceID
      data: {
        augmentedBids: BidRevampMetrics[]
        constants: any
        currentRound: any
        totalLockedTokens: any
        tranches: Tranche[]
      }
    }[]
  >
}) {
  const hydroData = use(hydroDataPromise)
  const initialStateWithData: AppState = {
    ...initialState,
    currentRoundDataPerSource: hydroData
      ? (Object.fromEntries(
          hydroData.map(({ sourceId, data }) => [
            sourceId,
            {
              sourceId,
              currentRoundId: data.currentRound?.round_id ?? 0,
              roundEnd: data.currentRound?.round_end ?? "",
              tranches: data.tranches ?? [],
              augmentedBids: data.augmentedBids ?? [],
              totalLockedTokens: data.totalLockedTokens ?? 0,
            },
          ])
        ) as Record<SourceID, RoundState>)
      : null,
  }

  const [state, dispatch] = useReducer(reducer, initialStateWithData)

  console.log(JSON.stringify(state).length, "bytes", { state })

  return <AppContext value={{ state, dispatch }}>{children}</AppContext>
}

export function useAppState() {
  return useContext(AppContext)
}
