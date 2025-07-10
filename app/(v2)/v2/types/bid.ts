import { AugmentedLockup, BidRevampMetrics, SanitizedVote } from '@/contract-apis/types'

export interface VoteButtonData {
  hasVotedForThisBid: boolean
  hasVotedInThisTranche: boolean
  hasVotedElsewhere: boolean
  votingPowerAvailableByTrancheId: Record<number, number>
  validLockups: AugmentedLockup[]
  hasLockupThatExtendsBidsDeploymentDuration: boolean
  votesThisRound: SanitizedVote[]
  votesThisTranche: SanitizedVote[]
}

export interface AugmentedBidWithVoteData extends BidRevampMetrics {
  voteButtonData: VoteButtonData
}

export interface AugmentedSourceData {
  augmentedBids: AugmentedBidWithVoteData[]
  augmentedLockups: AugmentedLockup[]
}
