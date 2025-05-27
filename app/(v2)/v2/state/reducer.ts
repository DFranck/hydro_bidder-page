export interface AppState {
  narrowBuckets: boolean
}

export type AppAction = {
  type: "SET_NARROW_BUCKETS"
  payload: boolean
}

export function reducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "SET_NARROW_BUCKETS":
      return { ...state, narrowBuckets: action.payload }

    default:
      return state
  }
}
