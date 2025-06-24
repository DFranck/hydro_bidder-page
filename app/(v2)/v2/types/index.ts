import { Tranche } from '@/app/ts_types/HydroBase.types'
import { BidMetaData, BidRevampMetrics, RoundPrices } from '@/contract-apis/types'
import { AugmentedBidWithVoteData } from './bid'
import { SourceID } from './environment'

export interface HydroSourceData {
  sourceId: SourceID
  data: {
    constants: any
    totalLockedTokens: number
    currentRound: any
    tranches: Tranche[]
    augmentedBids: BidRevampMetrics[] | AugmentedBidWithVoteData[]
    roundPrices?: RoundPrices
    atomPrice?: number
    walletData?: any
  }
}

export interface DataPromises {
  hydroDataPromise: Promise<Array<HydroSourceData>>
  bidDescriptionsPromise: Promise<Record<number, BidMetaData>>
}

// Re-export all types from organized files
export * from './bid'
export * from './environment'
export * from './hooks'
export * from './state'
