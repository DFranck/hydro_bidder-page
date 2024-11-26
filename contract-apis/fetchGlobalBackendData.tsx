"use cache"

import { HydroBaseQueryClient } from "@/app/ts_types/HydroBase.client"
import { Proposal, Tranche } from "@/app/ts_types/HydroBase.types"
import { Tribute } from "@/app/ts_types/TributeBase.types"
import { fetchAssetListWithPrices } from "@/contract-apis/fetchAssetListWithPrices"
import {
  BidDescription,
  fetchBidDescriptionsById,
} from "@/contract-apis/fetchBidDescriptions"
import {
  fetchNumiaData,
  SanitizedBidFromNumia,
} from "@/contract-apis/fetchNumiaData"
import { fetchProposalTributes } from "@/contract-apis/fetchProposalTributes"
import { getCosmWasmClient } from "@/contract-apis/getCosmWasmClient"
import {
  CamelCaseKeys,
  keysFromSnakeToCamelCase,
} from "@/lib/keysFromSnakeToCamelCase"

export interface BidFromContract extends Proposal {}

export interface BidWithTributes extends CamelCaseKeys<BidFromContract> {
  tributes: Tribute[]
}

export interface GlobalBackendData {
  bidsByRoundId: Map<number, BidWithTributes[]>
  bidDescriptionsById: Record<string, BidDescription>
  preHydroBids: SanitizedBidFromNumia[]
  currentRoundMetadata: {
    roundEnd: Date
    roundId: number
    tranches: Tranche[]
  }
  globalMetadata: {
    atomPrice: number
    totalLockedTokens: number
    maxLockedTokens: number
  }
}

export async function fetchGlobalBackendData(): Promise<GlobalBackendData> {
  if (!process.env.NEXT_PUBLIC_HYDRO_CONTRACT_ADDRESS) {
    throw new Error("Hydro contract address not set")
  }

  const client = await getCosmWasmClient()

  const hydroQueryClient = new HydroBaseQueryClient(
    client,
    process.env.NEXT_PUBLIC_HYDRO_CONTRACT_ADDRESS
  )

  const [
    { constants },
    { round_end: currentRoundEnd, round_id: currentRoundId },
    { tranches },
    { total_locked_tokens: totalLockedTokens },
    assetListWithPrices,
    { preHydroBids },
    bidDescriptionsById,
  ] = await Promise.all([
    hydroQueryClient.constants(),
    hydroQueryClient.currentRound(),
    hydroQueryClient.tranches(),
    hydroQueryClient.totalLockedTokens(),
    fetchAssetListWithPrices(),
    fetchNumiaData(),
    fetchBidDescriptionsById(),
  ])

  const bidsByRoundId = new Map<number, BidWithTributes[]>()

  await Promise.all(
    Array.from({ length: currentRoundId + 1 }, (_, roundId) =>
      Promise.all(
        tranches.map(async (tranche) => {
          const { proposals: bids } = await hydroQueryClient.roundProposals({
            limit: 50,
            roundId,
            startFrom: 0,
            trancheId: tranche.id,
          })

          const tributesResults = await Promise.all(
            bids.map((bid) =>
              fetchProposalTributes(roundId, tranche.id, bid.proposal_id)
            )
          )

          const tributes = tributesResults.flat()

          const camelCasedBids = bids.map((bid) => ({
            ...keysFromSnakeToCamelCase(bid),
            tributes,
          }))

          if (!bidsByRoundId.has(roundId)) {
            bidsByRoundId.set(roundId, [])
          }

          bidsByRoundId.get(roundId)?.push(...camelCasedBids)
        })
      )
    )
  )

  const atomPrice =
    assetListWithPrices.get(
      "ibc/C4CFF46FD6DE35CA4CF4CE031E643C8FDC9BA4B99AE598E9B0ED98FE3A2319F9"
    )?.priceUsd ?? 0

  return {
    bidDescriptionsById,
    bidsByRoundId,
    preHydroBids,
    currentRoundMetadata: {
      roundEnd: new Date(currentRoundEnd),
      roundId: currentRoundId,
      tranches,
    },
    globalMetadata: {
      atomPrice,
      maxLockedTokens: constants.max_locked_tokens,
      totalLockedTokens,
    },
  }
}
