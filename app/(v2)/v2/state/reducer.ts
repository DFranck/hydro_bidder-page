import { Tranche } from '@/app/ts_types/HydroBase.types'
import { AppState } from '@v2/state/DataProviderOnServer'

export type AppAction =
  | {
      type: 'SET_IS_LOADING'
      payload: boolean
    }
  | {
      type: 'SET_ROUND_METADATA'
      payload: {
        currentRoundId: number
        roundEnd: string
        tranches: Tranche[]
      }
    }
  | {
      type: 'SET_NARROW_BUCKETS'
      payload: boolean
    }
  | {
      type: 'SET_ACTIVE_TRANCHE_INDEX'
      payload: number
    }
  | {
      type: 'SET_SIDEBAR_OPEN'
      payload: boolean
    }
  | {
      type: 'SET_STATE'
      payload: Partial<AppState>
    }

export function reducer(state: AppState, action: AppAction): AppState {
  console.log('Action:', action)
  console.log('State before:', state)

  const newState = (() => {
    switch (action.type) {
      case 'SET_IS_LOADING':
        return { ...state, isLoading: action.payload }

      case 'SET_ROUND_METADATA':
        return { ...state, ...action.payload }

      case 'SET_NARROW_BUCKETS':
        return { ...state, narrowBuckets: action.payload }

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
