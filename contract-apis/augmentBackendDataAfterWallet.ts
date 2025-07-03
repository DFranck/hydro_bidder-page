import { augmentLockup } from "@/contract-apis/augmentLockup"
import {
  AugmentedBackendDataAfterWallet,
  AugmentedBackendDataBeforeWallet,
  AugmentedLockup,
  SanitizedVote,
} from "@/contract-apis/types"
import { estimatedRewardForPower } from "@/lib/estimatedRewardForPower"
import { keysFromSnakeToCamelCase } from "@/lib/keysFromSnakeToCamelCase"
import groupBy from "lodash/groupBy"
import keyBy from "lodash/keyBy"
import sumBy from "lodash/sumBy"
import { augmentClaimWithRoundPrices } from "./augmentClaimWithRoundPrices"
import { TOKEN_DENOMS } from "@/lib/tokenDenoms"

export function augmentBackendDataAfterWallet({
  address,
  augmentedBackendDataBeforeWallet,
  walletData,
  lockedAtomRemainingCapacityGlobal,
}: {
  address: string
  augmentedBackendDataBeforeWallet: AugmentedBackendDataBeforeWallet
  walletData: Awaited<
    ReturnType<typeof import("./fetchWalletData").fetchWalletData>
  >
  lockedAtomRemainingCapacityGlobal: number
}): AugmentedBackendDataAfterWallet {
  const { bidsInfo, currentRoundId, currentRoundPrices } =
    augmentedBackendDataBeforeWallet

  const {
    historical_tribute_claims,
    lockups_with_per_tranche_infos,
    outstanding_tribute_claims,
    votes,
    voting_power,
    currently_locked,
    maxUserCanLock,
    hasGatekeeper,
  } = walletData

  let lockedAtomMaxWallet = 0
  if (!hasGatekeeper) {
    lockedAtomMaxWallet = lockedAtomRemainingCapacityGlobal
  } else {
    lockedAtomMaxWallet = maxUserCanLock ? Number(maxUserCanLock) / 1e6 : 0
  }

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
        amount: bid.totalTokenBasedTributeValue,
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
    (vote) => bidsInfo[vote.bidId]?.roundId
  )

  const augmentedHistoricalClaims = historical_tribute_claims.map((o) =>
    augmentClaimWithRoundPrices({
      roundPrices: currentRoundPrices,
      claim: o,
    })
  )

  const augmentedOutstandingClaims = outstanding_tribute_claims.map((o) =>
    augmentClaimWithRoundPrices({
      roundPrices: currentRoundPrices,
      claim: o,
    })
  )

  const lockedAtomTotalWalletStat = sumBy(
    augmentedLockups.filter(
      (lockup) =>
        ![TOKEN_DENOMS.stATOM, TOKEN_DENOMS.dATOM].includes(lockup.funds.denom)
    ),
    "funds.amount"
  )

  const lockedStAtomTotalWalletStat = sumBy(
    augmentedLockups.filter(
      (lockup) => lockup.funds.denom === TOKEN_DENOMS.stATOM
    ),
    "funds.amount"
  )

  const lockedDAtomTotalWalletStat = sumBy(
    augmentedLockups.filter(
      (lockup) => lockup.funds.denom === TOKEN_DENOMS.dATOM
    ),
    "funds.amount"
  )

  const lockedTokenTotalWalletStat =
    lockedAtomTotalWalletStat +
    lockedStAtomTotalWalletStat +
    lockedDAtomTotalWalletStat


  const lockedAtomTotalWallet = Number(currently_locked) / 1e6
  const lockedAtomPercentageWallet = Math.floor(
    (lockedAtomTotalWallet / lockedAtomMaxWallet) * 100
  )

  const votingPowerTotal = voting_power / 1e6

  const usedLockupsPerTranche: Record<string, AugmentedLockup[]> = {}
  augmentedLockups.forEach((lockup) => {
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
        sumBy(usedLockupsPerTranche[curr], (l) =>
          Number(l.currentVotingPower)
        ) /
          1e6
      return acc
    },
    {} as Record<string, number>
  )

  const votingPowerAvailableByTrancheId = Object.keys(
    votingPowerSpentByTrancheId
  ).reduce(
    (acc, curr) => {
      if (!acc[curr]) {
        acc[curr] = 0
      }
      acc[curr] = votingPowerTotal - votingPowerSpentByTrancheId[curr]
      return acc
    },
    {} as Record<string, number>
  )

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
    lockedAtomTotalWalletStat,
    lockedStAtomTotalWalletStat,
    lockedDAtomTotalWalletStat,
    lockedTokenTotalWalletStat,
    lockedAtomTotalWallet,
    lockups: augmentedLockups,
    votes: sanitizedVotes,
    votesByRoundId,
    votingPowerSpentByTrancheId,
    votingPowerAvailableByTrancheId,
    votingPowerTotal,
    hasGatekeeper,
  }
}
