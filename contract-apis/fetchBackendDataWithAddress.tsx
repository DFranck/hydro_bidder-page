"use server"

import { HydroBaseQueryClient } from "@/app/ts_types/HydroBase.client"
import {
  LockEntryWithPower,
  VoteWithPower,
} from "@/app/ts_types/HydroBase.types"
import { TributeBaseQueryClient } from "@/app/ts_types/TributeBase.client"
import {
  AugmentedBidFromContract,
  BackendData,
} from "@/contract-apis/fetchBackendDataWithoutAddress"
import { getCosmWasmClient } from "@/contract-apis/getCosmWasmClient"
import { sumBy } from "lodash"

export interface BackendDataWithAddress
  extends Omit<BackendData, "bidsByRoundId"> {
  address: string
  bidsByRoundId: Map<number, FullyAugmentedBid[]>
  isLoading: boolean
  isWalletConnected: boolean
  currentRoundMetadata: BackendData["currentRoundMetadata"] & {
    votes: VoteWithPower[][]
    votingPower: number
  }
  globalMetadata: BackendData["globalMetadata"] & {
    atomPrice: number
    totalLockedTokens: number
    maxLockedTokens: number
  }
  lockups: {
    count: number
    lockups: LockEntryWithPower[]
    totalAtomLocked: number
  }
}

export interface FullyAugmentedBid extends AugmentedBidFromContract {}

export async function fetchBackendDataWithAddress({
  address,
  backendData,
}: {
  address: string
  backendData: BackendData
}): Promise<BackendDataWithAddress> {
  if (!process.env.NEXT_PUBLIC_HYDRO_CONTRACT_ADDRESS) {
    throw new Error("Hydro contract address not set")
  }

  if (!process.env.NEXT_PUBLIC_TRIBUTE_CONTRACT_ADDRESS) {
    throw new Error("Tribute contract address not set")
  }

  const cosmWasmClient = await getCosmWasmClient()

  const tributeQueryClient = new TributeBaseQueryClient(
    cosmWasmClient,
    process.env.NEXT_PUBLIC_TRIBUTE_CONTRACT_ADDRESS
  )

  const hydroQueryClient = new HydroBaseQueryClient(
    cosmWasmClient,
    process.env.NEXT_PUBLIC_HYDRO_CONTRACT_ADDRESS
  )

  const {
    bidDescriptionsByBidId,
    bidsByRoundId,
    currentRoundMetadata,
    globalMetadata,
  } = backendData

  const { roundId, tranches } = currentRoundMetadata

  const { atomPrice, maxLockedTokens, totalLockedTokens } = globalMetadata

  const [{ voting_power: votingPower }, { lockups }] = await Promise.all([
    hydroQueryClient.userVotingPower({ address }),
    hydroQueryClient.allUserLockups({
      address,
      limit: 10_000,
      startFrom: 0,
    }),
  ])

  const votes = await Promise.all(
    tranches.map(async (tranche) => {
      const { votes } = await hydroQueryClient.userVotes({
        address,
        roundId,
        trancheId: tranche.id,
      })
      return votes
    })
  )

  const augmentedBidsByRoundId = Object.fromEntries(
    Object.entries(bidsByRoundId).map(([roundId, bids]) => [
      roundId,
      bids.map((bid: AugmentedBidFromContract) => ({
        ...bid,
        description: bidDescriptionsByBidId[bid.proposalId],
      })),
    ])
  ) as Map<number, AugmentedBidFromContract[]>

  return {
    ...backendData,
    address,
    bidsByRoundId: augmentedBidsByRoundId,
    isLoading: false,
    isWalletConnected: true,
    currentRoundMetadata: {
      ...currentRoundMetadata,
      votes,
      votingPower,
    },
    lockups: {
      count: lockups.length,
      lockups,
      totalAtomLocked: sumBy(lockups, "lock_entry.funds.amount"),
    },
  }
}
