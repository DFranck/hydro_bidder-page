"use server"

import { HydroBaseQueryClient } from "@/app/ts_types/HydroBase.client"
import {
  Coin,
  LockEntryWithPower,
  VoteWithPower,
} from "@/app/ts_types/HydroBase.types"
import {
  AugmentedBidFromContract,
  BackendData,
} from "@/contract-apis/fetchBackendDataWithoutWallet"
import { getCosmWasmClient } from "@/contract-apis/getCosmWasmClient"
import {
  CamelCaseKeys,
  keysFromSnakeToCamelCase,
} from "@/lib/keysFromSnakeToCamelCase"
import { sortBy, sumBy } from "lodash"
import { unstable_cache } from "next/cache"

export interface BackendDataWithWallet
  extends Omit<BackendData, "bidsByRoundId"> {
  address: string
  bidsByRoundId: Record<number, FullyAugmentedBid[]>
  isLoading: boolean
  isWalletConnected: boolean
  maxLockedAtomUser: number
  totalLockedAtomUser: number
  lockups: SanitizedLockup[]
  votes: SanitizedVote[]
  votingPower: number
}

export interface SanitizedLockup {
  currentVotingPower: number
  dateEnd: Date
  dateStart: Date
  funds: Coin
  id: number
}

export interface SanitizedVote
  extends Omit<CamelCaseKeys<VoteWithPower>, "propId"> {
  bidId: number
}

export interface FullyAugmentedBid extends AugmentedBidFromContract {
  lockupsOutliveBidDeployment: boolean
  usersEstimatedRewards: number
  usersEstimatedRewardsDeltaPercentage: number
}

function sanitizeLockup(lockup: LockEntryWithPower): SanitizedLockup {
  return {
    currentVotingPower: Number(lockup.current_voting_power),
    dateEnd: new Date(Number(lockup.lock_entry.lock_end) / 1e6),
    dateStart: new Date(Number(lockup.lock_entry.lock_start) / 1e6),
    funds: lockup.lock_entry.funds,
    id: lockup.lock_entry.lock_id,
  }
}

function sanitizeVote(vote: VoteWithPower): SanitizedVote {
  const { propId, ...rest } = keysFromSnakeToCamelCase(vote)
  return {
    ...rest,
    bidId: propId,
  }
}

async function uncachedFetchBackendDataWithWallet({
  address,
  backendData,
}: {
  address: string
  backendData: BackendData
}): Promise<BackendDataWithWallet> {
  if (!process.env.NEXT_PUBLIC_HYDRO_CONTRACT_ADDRESS) {
    throw new Error("Hydro contract address not set")
  }

  const cosmWasmClient = await getCosmWasmClient()
  const hydroQueryClient = new HydroBaseQueryClient(
    cosmWasmClient,
    process.env.NEXT_PUBLIC_HYDRO_CONTRACT_ADDRESS
  )

  const {
    bidDescriptionsByBidId,
    bidsByRoundId,
    currentRoundEndDate,
    currentRoundId,
    currentRoundTranches,
    lockupEpochLength,
  } = backendData

  const [{ voting_power: votingPower }, { lockups }] = await Promise.all([
    hydroQueryClient.userVotingPower({ address }),
    hydroQueryClient.allUserLockups({
      address,
      limit: 10_000,
      startFrom: 0,
    }),
  ])

  const votes = await Promise.all(
    currentRoundTranches.map(async (tranche) => {
      let fetchedVotes: VoteWithPower[] = []

      try {
        const { votes: votesForTranche } = await hydroQueryClient.userVotes({
          address,
          roundId: currentRoundId,
          trancheId: tranche.id,
        })
        fetchedVotes = votesForTranche
      } catch (err) {
        // TODO: no votes for this tranche; shouldn't throw exception though??
      }

      return fetchedVotes
    })
  )

  const sanitizedLockups = lockups.map(sanitizeLockup)

  const sanitizedVotes = votes.flat().map(sanitizeVote)

  const furthestLockupEndDate = sortBy(sanitizedLockups, "dateEnd").reverse()[0]
    ?.dateEnd

  const augmentedBidsByRoundId = Object.fromEntries(
    Object.entries(bidsByRoundId).map(([roundId, bids]) => {
      return [
        roundId,
        bids.map((bid) => {
          const usersEstimatedRewards = sumBy(bid.tributes, "valueInUsd")
          const bidDeploymentDuration =
            Number(bid.deploymentDuration * lockupEpochLength) / 1e6
          const currentRoundEndDateForSure =
            typeof currentRoundEndDate === "string"
              ? new Date(currentRoundEndDate)
              : currentRoundEndDate
          const lockupsOutliveBidDeployment =
            furthestLockupEndDate && currentRoundEndDate
              ? furthestLockupEndDate >
                new Date(
                  currentRoundEndDateForSure.getTime() + bidDeploymentDuration
                )
              : false

          return {
            ...bid,
            description:
              bidDescriptionsByBidId[bid.id].description ?? bid.description,
            lockupsOutliveBidDeployment,
            usersEstimatedRewards,
            usersEstimatedRewardsDeltaPercentage: 0,
          }
        }),
      ]
    })
  )

  return {
    ...backendData,
    address,
    bidsByRoundId: augmentedBidsByRoundId,
    isLoading: false,
    isWalletConnected: true,
    // TODO: get this from contract
    maxLockedAtomUser: 200,
    totalLockedAtomUser: sumBy(lockups, "lock_entry.funds.amount"),
    lockups: sanitizedLockups,
    votes: sanitizedVotes,
    votingPower,
  }
}

export const fetchBackendDataWithWallet = unstable_cache(
  uncachedFetchBackendDataWithWallet,
  ["fetchBackendDataWithWallet"],
  {
    revalidate: 60 * 5, // 5 minutes
  }
)
