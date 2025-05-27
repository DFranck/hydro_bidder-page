"use client"

import { createContext, Dispatch, ReactNode, use, useReducer } from "react"
import { AppAction, AppState, reducer } from "./reducer"

export const AppContext = createContext<{
  state: AppState
  dispatch: Dispatch<AppAction>
}>({
  state: {
    narrowBuckets: false,
  },
  dispatch: () => {},
})

export function AppContextProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, {
    narrowBuckets: false,
  })

  return <AppContext value={{ state, dispatch }}>{children}</AppContext>
}

export function useAppState() {
  return use(AppContext)
}
