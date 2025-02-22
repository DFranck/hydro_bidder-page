import { augmentLockup } from "@/contract-apis/augmentLockup"
import {
  AugmentedBackendDataAfterWallet,
  AugmentedBackendDataBeforeWallet,
  SanitizedVote,
} from "@/contract-apis/types"
import { estimatedRewardForPower } from "@/lib/estimatedRewardForPower"
import { keysFromSnakeToCamelCase } from "@/lib/keysFromSnakeToCamelCase"
import groupBy from "lodash/groupBy"
import keyBy from "lodash/keyBy"
import sortBy from "lodash/sortBy"
import sumBy from "lodash/sumBy"
import { augmentClaim } from "./augmentClaim"

export function augmentBackendDataAfterWallet({
  address,
  augmentedBackendDataBeforeWallet,
  walletData,
}: {
  address: string
  augmentedBackendDataBeforeWallet: AugmentedBackendDataBeforeWallet
  walletData: Awaited<
    ReturnType<typeof import("./fetchWalletData").fetchWalletData>
  >
}): AugmentedBackendDataAfterWallet {
  const {
    assetListWithPrices,
    bidDescriptionsByBidId,
    bidsById,
    currentRoundEndDate,
    currentRoundId,
    lockedAtomMaxWallet,
    lockedAtomEpochInNanos,
  } = augmentedBackendDataBeforeWallet

  const {
    historical_tribute_claims,
    lockups_with_per_tranche_infos,
    outstanding_tribute_claims,
    votes,
    voting_power,
  } = walletData

  const allBids = Object.values(bidsById)

  const sanitizedVotes = votes.map((vote) => {
    const { propId, ...rest } = keysFromSnakeToCamelCase(vote)
    return { ...rest, bidId: propId } as SanitizedVote
  })

  const augmentedLockups = lockups_with_per_tranche_infos.map((o) =>
    augmentLockup(o, currentRoundId)
  )

  const furthestLockupEndDate = sortBy(augmentedLockups, "dateEnd").reverse()[0]
    ?.dateEnd

  const votedBidId =
    allBids
      .filter((bid) => bid.roundId === currentRoundId)
      .find((bid) => sanitizedVotes.some((vote) => vote.bidId === bid.id))
      ?.id ?? null

  const bidsWithRewards = allBids.map((bid) => {
    const description =
      bidDescriptionsByBidId[bid.id]?.description ?? bid.description

    const usersEstimatedRewards =
      estimatedRewardForPower({
        amount: sumBy(bid.tributes, "valueUsd"),
        walletVotingPower: voting_power,
        bidPower: Number(bid.power),
      }) ?? 0

    const deploymentDurationMinusAnEpochInMilliseconds =
      ((bid.deploymentDurationInEpochs - 1) * lockedAtomEpochInNanos) / 1e6

    const currentRoundEndDateForSure =
      typeof currentRoundEndDate === "string"
        ? new Date(currentRoundEndDate)
        : currentRoundEndDate

    const lockupsOutliveBidDeployment =
      furthestLockupEndDate && currentRoundEndDate
        ? furthestLockupEndDate >
          new Date(
            currentRoundEndDateForSure.getTime() +
              deploymentDurationMinusAnEpochInMilliseconds
          )
        : false

    return {
      ...bid,
      description,
      lockupsOutliveBidDeployment,
      usersEstimatedRewards,
      usersEstimatedRewardRelativeToCurrentPick: 0,
    }
  })

  const votedBid = bidsWithRewards.find((bid) => bid.id === votedBidId) ?? null

  const bidsWithRewardsRelativeToCurrentPick = bidsWithRewards.map((bid) => ({
    ...bid,
    usersEstimatedRewardRelativeToCurrentPick:
      votedBid && votedBid.usersEstimatedRewards && bid.usersEstimatedRewards
        ? (100 * (bid.usersEstimatedRewards - votedBid.usersEstimatedRewards)) /
          votedBid.usersEstimatedRewards
        : 0,
  }))

  const augmentedBidsById = keyBy(
    bidsWithRewardsRelativeToCurrentPick,
    (bid) => bid.id
  )

  const votesByRoundId = groupBy(
    sanitizedVotes,
    (vote) => bidsById[vote.bidId].roundId
  )

  const augmentedHistoricalClaims = historical_tribute_claims.map((o) =>
    augmentClaim({
      assetListWithPrices,
      claim: o,
    })
  )

  const augmentedOutstandingClaims = outstanding_tribute_claims.map((o) =>
    augmentClaim({
      assetListWithPrices,
      claim: o,
    })
  )

  const lockedAtomTotalWallet = sumBy(
    lockups_with_per_tranche_infos,
    "funds.amount"
  )
  const lockedAtomPercentageWallet = Math.floor(
    (lockedAtomTotalWallet / lockedAtomMaxWallet) * 100
  )

  const usedLockups = augmentedLockups.filter(
    (lockup) => lockup.isTiedToDeployment
  )
  const votingPowerSpent =
    sumBy(usedLockups, (l) => Number(l.currentVotingPower)) / 1e6
  const votingPowerTotal = voting_power / 1e6
  const votingPowerAvailable = votingPowerTotal - votingPowerSpent

  return {
    ...augmentedBackendDataBeforeWallet,
    address,
    bidsById: augmentedBidsById,
    claimsHistorical: augmentedHistoricalClaims,
    claimsOutstanding: augmentedOutstandingClaims,
    isLoading: false,
    isWalletConnected: true,
    lockedAtomIsAtCapacityWallet: lockedAtomTotalWallet === lockedAtomMaxWallet,
    lockedAtomMaxWallet,
    lockedAtomPercentageWallet,
    lockedAtomTotalWallet,
    lockups: augmentedLockups,
    votes: sanitizedVotes,
    votesByRoundId,
    votingPowerAvailable,
    votingPowerSpent,
    votingPowerTotal,
  }
}
