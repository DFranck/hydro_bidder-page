"use server"

import { HydroBaseQueryClient } from "@/app/ts_types/HydroBase.client"
import { VoteWithPower } from "@/app/ts_types/HydroBase.types"
import { getEndpoints } from "@/config"
import {
  AugmentedBidFromContract,
  BackendDataBeforeWallet,
} from "@/contract-apis/fetchBackendDataBeforeWallet"
import { AugmentedClaim, fetchClaims } from "@/contract-apis/fetchClaims"
import {
  fetchWalletLockups,
  SanitizedLockup,
} from "@/contract-apis/fetchWalletLockups"
import { getCosmWasmClient } from "@/contract-apis/getCosmWasmClient"
import { estimatedRewardForPower } from "@/lib/estimatedRewardForPower"
import {
  CamelCaseKeys,
  keysFromSnakeToCamelCase,
} from "@/lib/keysFromSnakeToCamelCase"
import groupBy from "lodash/groupBy"
import keyBy from "lodash/keyBy"
import range from "lodash/range"
import sortBy from "lodash/sortBy"
import sumBy from "lodash/sumBy"
import { unstable_cache } from "next/cache"
import { augmentClaims } from "./augmentClaims"

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
  backendDataBeforeWallet,
}: {
  address: string
  backendDataBeforeWallet: BackendDataBeforeWallet
}): Promise<BackendDataAfterWallet> {
  if (!process.env.NEXT_PUBLIC_HYDRO_CONTRACT_ADDRESS) {
    throw new Error("Hydro contract address not set")
  }

  const neutronRpcEndpoint = getEndpoints({
    environmentVariables: {
      NUMIA_COSMOS_HYDRO_APP_API_KEY:
        process.env.NUMIA_COSMOS_HYDRO_APP_API_KEY!,
    },
  }).neutron.rpc[0]

  const cosmWasmClient = await getCosmWasmClient({
    endpoint: neutronRpcEndpoint,
  })
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
    tranches,
  } = backendDataBeforeWallet

  const [{ voting_power: votingPowerFromContract }, sanitizedLockups] =
    await Promise.all([
      hydroQueryClient.userVotingPower({ address }),
      fetchWalletLockups({ address, currentRoundId }),
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

  // get all lockups that are tied to a deployment:
  // not expired, and not tied to a deployment that has ended
  const usedLockups = sanitizedLockups.filter(
    (lockup) => lockup.isTiedToDeployment
  )

  const votingPowerSpent =
    sumBy(usedLockups, (l) => Number(l.currentVotingPower)) / 1e6

  const votingPowerTotal = votingPowerFromContract / 1e6

  const votingPowerAvailable = votingPowerTotal - votingPowerSpent

  const backendDataAfterWallet: BackendDataAfterWallet = {
    ...backendDataBeforeWallet,
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
    votingPowerTotal,
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
