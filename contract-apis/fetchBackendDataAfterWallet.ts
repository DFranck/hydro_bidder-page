"use server"

import { HydroBaseQueryClient } from "@/app/ts_types/HydroBase.client"
import { VoteWithPower } from "@/app/ts_types/HydroBase.types"
import {
  AugmentedBidFromContract,
  BackendDataBeforeWallet,
} from "@/contract-apis/fetchBackendDataBeforeWallet"
import {
  augmentClaims,
  AugmentedClaim,
  fetchClaims,
} from "@/contract-apis/fetchClaims"
import { fetchWalletLockups } from "@/contract-apis/fetchWalletLockups"
import { getCosmWasmClient } from "@/contract-apis/getCosmWasmClient"
import { estimatedRewardForPower } from "@/lib/estimatedRewardForPower"
import {
  CamelCaseKeys,
  keysFromSnakeToCamelCase,
} from "@/lib/keysFromSnakeToCamelCase"
import { groupBy, keyBy, range, sortBy, sumBy } from "lodash"
import { unstable_cache } from "next/cache"

export interface BackendDataAfterWallet
  extends Omit<BackendDataBeforeWallet, "bids"> {
  address: string
  bids: AugmentedBid[]
  bidsById: Record<number, AugmentedBid>
  bidsByRoundId: Record<number, AugmentedBid[]>
  claimsHistorical: AugmentedClaim[]
  claimsOutstanding: AugmentedClaim[]
  isLoading: boolean
  isWalletConnected: boolean
  lockedAtomIsAtCapacityWallet: boolean
  lockedAtomPercentageWallet: number
  lockedAtomTotalWallet: number
  lockups: SanitizedLockup[]
  votes: SanitizedVote[]
  votesByRoundId: Record<string, SanitizedVote[]>
  votingPowerAvailable: number
  votingPowerSpent: number
  votingPowerTotal: number
}

export interface SanitizedLockup {
  id: number
  currentVotingPower: number
  dateEnd: Date
  dateStart: Date
  funds: {
    amount: number
    denom: string
  }
  multiplier: number
  metaDataByTrancheId: Record<
    number,
    {
      nextRoundEligibleToVote: number | null
      votedOnBidId: number | null
    }
  >
}

export interface SanitizedVote
  extends Omit<CamelCaseKeys<VoteWithPower>, "propId"> {
  bidId: number
}

export interface AugmentedBid extends AugmentedBidFromContract {
  lockupsOutliveBidDeployment: boolean
  usersEstimatedRewards: number
  usersEstimatedRewardRelativeToCurrentPick: number
}

function sanitizeVote(vote: VoteWithPower): SanitizedVote {
  const { propId, ...rest } = keysFromSnakeToCamelCase(vote)
  return {
    ...rest,
    bidId: propId,
  }
}

async function uncachedFetchBackendDataAfterWallet({
  address,
  backendData,
}: {
  address: string
  backendData: BackendDataBeforeWallet
}): Promise<BackendDataAfterWallet> {
  if (!process.env.NEXT_PUBLIC_HYDRO_CONTRACT_ADDRESS) {
    throw new Error("Hydro contract address not set")
  }

  const cosmWasmClient = await getCosmWasmClient()
  const hydroQueryClient = new HydroBaseQueryClient(
    cosmWasmClient,
    process.env.NEXT_PUBLIC_HYDRO_CONTRACT_ADDRESS
  )

  const {
    assetListWithPrices,
    bidDescriptionsByBidId,
    bids,
    currentRoundEndDate,
    currentRoundId,
    lockedAtomMaxWallet,
    lockedAtomEpochInNanos,
    metricsForPostHydroBids,
    tranches,
  } = backendData

  const [{ voting_power: votingPowerFromContract }, sanitizedLockups] =
    await Promise.all([
      hydroQueryClient.userVotingPower({ address }),
      fetchWalletLockups(address),
    ])

  // [0, 1, 2, ...currentRoundId]
  const allRoundIds = range(0, currentRoundId + 1)

  const votes = await Promise.all(
    allRoundIds.map(async (roundId) =>
      Promise.all(
        tranches.map(async (tranche) => {
          let fetchedVotes: VoteWithPower[] = []

          try {
            const { votes: votesForTranche } = await hydroQueryClient.userVotes(
              {
                address,
                roundId,
                trancheId: tranche.id,
              }
            )
            fetchedVotes = votesForTranche
          } catch (err) {
            // TODO: no votes for this tranche; shouldn't throw exception though??
          }

          return fetchedVotes
        })
      )
    )
  )
  
  const sanitizedVotes = votes.flat().flat().map(sanitizeVote)

  // filter out votes for bids whose deployment duration is up (bid.round_id + bid.deployment_duration <= currentRoundId)
  const activeVotes = votes.map((votesForRound) =>
    votesForRound.map((votesForTranche) =>
      votesForTranche.filter((vote) => {
        const bid = bids.find((bid) => bid.id === vote.prop_id)
        return bid && bid.roundId + bid.deploymentDurationInEpochs > currentRoundId
      })
    )
  )

  const furthestLockupEndDate = sortBy(sanitizedLockups, "dateEnd").reverse()[0]
    ?.dateEnd

  const votedBidId =
    bids
      .filter((bid) => bid.roundId === currentRoundId)
      .find((bid) => sanitizedVotes.some((vote) => vote.bidId === bid.id))
      ?.id ?? null

  const bidsWithRewards = bids.map((bid) => {
    const description =
      bidDescriptionsByBidId[bid.id]?.description ?? bid.description

    const bidFromNumia = metricsForPostHydroBids.find(
      (bidFromNumia) => Number(bidFromNumia.id) === bid.id
    )

    const usersEstimatedRewards =
      estimatedRewardForPower({
        amount: sumBy(bid.tributes, "valueUsd"),
        walletVotingPower: votingPowerFromContract,
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

  const sanitizedBids: AugmentedBid[] = bidsWithRewardsRelativeToCurrentPick

  const bidsById = keyBy(sanitizedBids, (bid) => bid.id)

  const bidsByRoundId = groupBy(sanitizedBids, (bid) => bid.roundId)

  const votesByRoundId = groupBy(
    sanitizedVotes,
    (vote) => bidsById[vote.bidId].roundId
  )

  const { historicalClaims, outstandingClaims } = await fetchClaims({
    address,
    currentRoundId,
    trancheIds: tranches.map((tranche) => tranche.id),
  })

  const augmentedHistoricalClaims = augmentClaims({
    assetListWithPrices,
    claims: historicalClaims,
  })

  const augmentedOutstandingClaims = augmentClaims({
    assetListWithPrices,
    claims: outstandingClaims,
  })

  const lockedAtomTotalWallet = sumBy(sanitizedLockups, "funds.amount")

  const lockedAtomPercentageWallet = Math.floor(
    (lockedAtomTotalWallet / lockedAtomMaxWallet) * 100
  )

  const votingPowerSpent = sumBy(activeVotes, (v) => Number(v.power) / 1e6)

  const votingPowerAvailable = votingPowerFromContract / 1e6 - votingPowerSpent

  const backendDataAfterWallet: BackendDataAfterWallet = {
    ...backendData,
    address,
    bids: sanitizedBids,
    bidsById,
    bidsByRoundId,
    claimsHistorical: augmentedHistoricalClaims,
    claimsOutstanding: augmentedOutstandingClaims,
    isLoading: false,
    isWalletConnected: true,
    lockedAtomIsAtCapacityWallet: lockedAtomTotalWallet === lockedAtomMaxWallet,
    lockedAtomMaxWallet,
    lockedAtomPercentageWallet,
    lockedAtomTotalWallet,
    lockups: sanitizedLockups,
    votes: sanitizedVotes,
    votesByRoundId,
    votingPowerAvailable,
    votingPowerSpent,
    votingPowerTotal: votingPowerFromContract / 1e6,
  }

  return backendDataAfterWallet
}

export const fetchBackendDataAfterWallet = unstable_cache(
  uncachedFetchBackendDataAfterWallet,
  ["fetchBackendDataAfterWallet"],
  {
    revalidate: 60 * 5, // 5 minutes
    tags: ["backendData"],
  }
)
