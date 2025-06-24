import { AppAction, AppState } from '@v2/types'

export type { AppAction }

export function reducer(state: AppState, action: AppAction): AppState {
  console.log('Action:', action)
  console.log('State before:', state)

  const newState = (() => {
    switch (action.type) {
      case 'SET_IS_LOADING':
        return { ...state, isLoading: action.payload }

      case 'SET_ROUND_METADATA':
        return { ...state, ...action.payload }

      case 'SET_ACTIVE_TRANCHE_INDEX':
        return { ...state, activeTrancheIndex: action.payload }

      case 'SET_SIDEBAR_OPEN':
        return { ...state, isSidebarOpen: action.payload }

      case 'SET_STATE':
        return { ...state, ...action.payload }

      default:
        return state
    }
  })()

  console.log('State after:', newState)
  return newState
}
