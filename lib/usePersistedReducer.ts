"use client"

import { Reducer, useEffect, useReducer } from "react"

export function usePersistedReducer<S extends {}, A>({
  reducer,
  initialState,
  key,
  persistedKeys = [],
  storage = localStorage,
}: {
  reducer: Reducer<S, A>
  initialState: S
  key: string
  persistedKeys?: string[]
  storage?: Storage
}) {
  const [state, dispatch] = useReducer(
    reducer,
    initialState,
    (_initialState) => {
      if (typeof storage === "undefined") return _initialState
      const persisted = storage.getItem(key)
      return persisted
        ? { ..._initialState, ...JSON.parse(persisted) }
        : _initialState
    }
  )

  useEffect(() => {
    const filteredState =
      !persistedKeys || persistedKeys.length === 0
        ? state // Persist everything if no keys specified
        : Object.fromEntries(
            Object.entries(state).filter(([k]) => persistedKeys.includes(k))
          )

    storage.setItem(key, JSON.stringify(filteredState))
  }, [key, state, persistedKeys])

  return [state, dispatch] as const
}
