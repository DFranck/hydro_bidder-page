"use server"

import { HydroBaseQueryClient } from "@/app/ts_types/HydroBase.client"
import {
  LockEntryWithPower,
  VoteWithPower,
} from "@/app/ts_types/HydroBase.types"
import {
  AugmentedBidFromContract,
  BackendData,
} from "@/contract-apis/fetchBackendDataWithoutAddress"
import { getCosmWasmClient } from "@/contract-apis/getCosmWasmClient"
import {
  CamelCaseKeys,
  keysFromSnakeToCamelCase,
} from "@/lib/keysFromSnakeToCamelCase"
import { sumBy } from "lodash"
import { unstable_cache } from "next/cache"

export interface BackendDataWithAddress
  extends Omit<BackendData, "bidsByRoundId"> {
  address: string
  bidsByRoundId: Record<number, FullyAugmentedBid[]>
  isLoading: boolean
  isWalletConnected: boolean
  maxLockedAtomUser: number
  totalLockedAtomUser: number
  usersLockups: LockEntryWithPower[]
  votes: SanitizedVote[]
  votingPower: number
}

export interface SanitizedVote
  extends Omit<CamelCaseKeys<VoteWithPower>, "propId"> {
  bidId: number
}

export interface FullyAugmentedBid extends AugmentedBidFromContract {
  usersEstimatedRewards: number
  usersEstimatedRewardsDeltaPercentage: number
}

async function uncachedFetchBackendDataWithAddress({
  address,
  backendData,
}: {
  address: string
  backendData: BackendData
}): Promise<BackendDataWithAddress> {
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
    currentRoundId,
    currentRoundTranches,
  } = backendData

  const [{ voting_power: votingPower }, { lockups }] = await Promise.all([
    hydroQueryClient.userVotingPower({ address }),
    hydroQueryClient.allUserLockups({
      address,
      limit: 10_000,
      startFrom: 0,
    }),
  ])

  const sanitizedVotes = (
    await Promise.all(
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
  )
    .flat()
    .map(keysFromSnakeToCamelCase)
    .map(({ propId, ...vote }) => ({
      ...vote,
      bidId: propId,
    }))

  const augmentedBidsByRoundId = Object.fromEntries(
    Object.entries(bidsByRoundId).map(([roundId, bids]) => {
      return [
        roundId,
        bids.map((bid: AugmentedBidFromContract) => {
          const usersEstimatedRewards = sumBy(bid.tributes, "valueInUsd")
          return {
            ...bid,
            description:
              bidDescriptionsByBidId[bid.id].description ?? bid.description,
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
    usersLockups: lockups,
    votes: sanitizedVotes,
    votingPower,
  }
}

export const fetchBackendDataWithAddress = unstable_cache(
  uncachedFetchBackendDataWithAddress,
  ["fetchBackendDataWithAddress"],
  {
    revalidate: 60 * 5, // 5 minutes
  }
)
