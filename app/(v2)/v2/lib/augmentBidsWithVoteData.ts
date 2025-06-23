import { augmentLockup } from '@/contract-apis/augmentLockup'
import { AugmentedLockup, BidRevampMetrics, SanitizedVote } from '@/contract-apis/types'
import { keysFromSnakeToCamelCase } from '@/lib/keysFromSnakeToCamelCase'
import groupBy from 'lodash/groupBy'

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

export function augmentBidsWithVoteData(
  bids: BidRevampMetrics[],
  walletData: any,
  currentRoundId: number,
  currentRoundEndDate: Date,
  lockedAtomEpochInNanos: number,
): AugmentedSourceData {
  if (!walletData) {
    return {
      augmentedBids: bids.map((bid) => ({
        ...bid,
        voteButtonData: {
          hasVotedForThisBid: false,
          hasVotedInThisTranche: false,
          hasVotedElsewhere: false,
          votingPowerAvailableByTrancheId: {},
          validLockups: [],
          hasLockupThatExtendsBidsDeploymentDuration: false,
          votesThisRound: [],
          votesThisTranche: [],
        },
      })),
      augmentedLockups: [],
    }
  }

  const lockups: AugmentedLockup[] = walletData.lockups_with_per_tranche_infos
    ? walletData.lockups_with_per_tranche_infos.map((lockup: any) =>
        augmentLockup(lockup, currentRoundId),
      )
    : []

  const votes: SanitizedVote[] = walletData.votes
    ? walletData.votes.map((vote: any) => {
        const { propId, ...rest } = keysFromSnakeToCamelCase(vote)
        return { ...rest, bidId: propId }
      })
    : []

  const votesByRoundId = groupBy(votes, (vote: SanitizedVote) => {
    const bidInfo = bids.find((b) => b.id === vote.bidId)
    return bidInfo?.roundId
  })

  const votingPowerTotal = (walletData.voting_power ?? 0) / 1e6
  const votingPowerAvailableByTrancheId: Record<number, number> = {}

  if (walletData.voting_power) {
    const usedLockupsPerTranche: Record<string, AugmentedLockup[]> = {}
    lockups.forEach((lockup: AugmentedLockup) => {
      Object.entries(lockup.metaDataByTrancheId).forEach(([id, tranche]) => {
        const trancheId = id
        if (!usedLockupsPerTranche[trancheId]) {
          usedLockupsPerTranche[trancheId] = []
        }
        if (tranche.isTiedToDeployment) {
          usedLockupsPerTranche[trancheId].push(lockup)
        }
      })
    })

    const votingPowerSpentByTrancheId = Object.keys(usedLockupsPerTranche).reduce(
      (acc, curr) => {
        if (!acc[curr]) {
          acc[curr] = 0
        }
        acc[curr] =
          acc[curr] +
          usedLockupsPerTranche[curr].reduce(
            (sum, l) => sum + Number(l.currentVotingPower),
            0,
          ) /
            1e6
        return acc
      },
      {} as Record<string, number>,
    )

    Object.keys(votingPowerSpentByTrancheId).forEach((trancheId) => {
      votingPowerAvailableByTrancheId[parseInt(trancheId)] =
        votingPowerTotal - votingPowerSpentByTrancheId[trancheId]
    })
  }

  const votesThisRound = votesByRoundId[currentRoundId] ?? []

  const augmentedBids = bids.map((bid) => {
    const votesThisTranche = votesThisRound.filter(
      (vote: SanitizedVote) => vote.bidId === bid.id,
    )
    const hasVotedInThisTranche = votesThisTranche.length > 0
    const hasVotedForThisBid = votesThisTranche.some(
      (vote: SanitizedVote) => vote.bidId === bid.id,
    )
    const hasVotedElsewhere = hasVotedInThisTranche && !hasVotedForThisBid

    const validLockups = lockups.filter((lockup: AugmentedLockup) => {
      if (!bid?.trancheId) return false
      return (
        (lockup.metaDataByTrancheId[bid.trancheId]?.nextRoundEligibleToVote ??
          Infinity) <= currentRoundId
      )
    })

    const hasLockupThatExtendsBidsDeploymentDuration = lockups.some(
      (lockup: AugmentedLockup) => {
        if (!bid || lockup.isExpired || !bid.trancheId) return false

        const nextRoundEligibleToVote = Number(
          lockup.metaDataByTrancheId[bid.trancheId]?.nextRoundEligibleToVote ??
            Infinity,
        )

        if (nextRoundEligibleToVote > currentRoundId) return false

        const powerRequiredRoundId = currentRoundId + bid.duration - 1

        const currentRoundEndTime = currentRoundEndDate.getTime() * 1e6
        const roundLength = lockedAtomEpochInNanos
        const powerRequiredRoundEnd =
          currentRoundEndTime +
          (powerRequiredRoundId - currentRoundId) * roundLength

        const lockEndTime = lockup.dateEnd.getTime() * 1e6

        return lockEndTime >= powerRequiredRoundEnd
      },
    )

    return {
      ...bid,
      voteButtonData: {
        hasVotedForThisBid,
        hasVotedInThisTranche,
        hasVotedElsewhere,
        votingPowerAvailableByTrancheId,
        validLockups,
        hasLockupThatExtendsBidsDeploymentDuration,
        votesThisRound,
        votesThisTranche,
      },
    }
  })

  return {
    augmentedBids,
    augmentedLockups: lockups,
  }
}
