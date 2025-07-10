import { Tranche } from '@/app/ts_types/HydroBase.types'
import { AugmentedLockup, BidMetaData, RoundPrices } from '@/contract-apis/types'
import { SourceID } from '@v2/environments'
import { AugmentedBidWithVoteData } from '@v2/lib/augmentBidsWithVoteData'

export interface AugmentedTranche extends Tranche {
  userVotedInTranche: boolean
  userVotedOnBidId: number | null
}

export interface RoundState {
  sourceId: SourceID
  currentRoundId: number
  roundEnd: string
  tranches: AugmentedTranche[]
  augmentedBids: AugmentedBidWithVoteData[]
  lockups: AugmentedLockup[]
  totalLockedTokens: number
  walletData?: any
  constants?: any
  roundPrices?: RoundPrices
  atomPrice?: number
}

export interface AppState {
  narrowBuckets: boolean
  currentRoundDataPerSource: Record<SourceID, RoundState> | null
  bidDescriptionsById: Record<number, BidMetaData>
  activeTrancheIndex: number
  isSidebarOpen: boolean
  isLoading: boolean
}

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
