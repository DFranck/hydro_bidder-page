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
  const { assetListWithPrices, bidsInfo, currentRoundId, lockedAtomMaxWallet } =
    augmentedBackendDataBeforeWallet

  const {
    historical_tribute_claims,
    lockups_with_per_tranche_infos,
    outstanding_tribute_claims,
    votes,
    voting_power,
  } = walletData

  const allBids = Object.values(bidsInfo)

  const sanitizedVotes = votes.map((vote) => {
    const { propId, ...rest } = keysFromSnakeToCamelCase(vote)
    return { ...rest, bidId: propId } as SanitizedVote
  })

  const augmentedLockups = lockups_with_per_tranche_infos.map((o) =>
    augmentLockup(o, currentRoundId)
  )

  const votedBidId =
    allBids
      .filter((bid) => bid.roundId === currentRoundId)
      .find((bid) => sanitizedVotes.some((vote) => vote.bidId === bid.id))
      ?.id ?? null

  const bidsWithRewards = allBids.map((bid) => {
    const usersEstimatedRewards =
      estimatedRewardForPower({
        amount: bid.tribute_value,
        walletVotingPower: voting_power,
        bidPower: Number(bid.power),
      }) ?? 0

    return {
      ...bid,
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

  const augmentedBidsInfo = keyBy(
    bidsWithRewardsRelativeToCurrentPick,
    (bid) => bid.id
  )

  const votesByRoundId = groupBy(
    sanitizedVotes,
    (vote) => bidsInfo[vote.bidId].roundId
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

  const lockedAtomTotalWallet = sumBy(augmentedLockups, "funds.amount")
  const lockedAtomPercentageWallet = Math.floor(
    (lockedAtomTotalWallet / lockedAtomMaxWallet) * 100
  )

  const usedLockups = augmentedLockups.filter((lockup) =>
    Object.values(lockup.metaDataByTrancheId).some(
      (metaData) => metaData.isTiedToDeployment
    )
  )
  const votingPowerSpent =
    sumBy(usedLockups, (l) => Number(l.currentVotingPower)) / 1e6
  const votingPowerTotal = voting_power / 1e6
  const votingPowerAvailable = votingPowerTotal - votingPowerSpent

  return {
    ...augmentedBackendDataBeforeWallet,
    address,
    bidsInfo: augmentedBidsInfo,
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
