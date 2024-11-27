"use server"

import { HydroBaseQueryClient } from "@/app/ts_types/HydroBase.client"
import { Coin, Proposal, Tranche } from "@/app/ts_types/HydroBase.types"
import { Tribute } from "@/app/ts_types/TributeBase.types"
import {
  AssetListEntry,
  fetchAssetListWithPrices,
} from "@/contract-apis/fetchAssetListWithPrices"
import {
  BidDescription,
  fetchBidDescriptionsById,
} from "@/contract-apis/fetchBidDescriptions"
import {
  fetchNumiaBidData,
  SanitizedBidFromNumia,
} from "@/contract-apis/fetchNumiaBidData"
import {
  fetchNumiaMetricsData,
  SanitizedMetricsFromNumia,
} from "@/contract-apis/fetchNumiaMetricsData"
import { fetchProposalTributes } from "@/contract-apis/fetchProposalTributes"
import { getCosmWasmClient } from "@/contract-apis/getCosmWasmClient"
import {
  CamelCaseKeys,
  keysFromSnakeToCamelCase,
} from "@/lib/keysFromSnakeToCamelCase"

export interface BidFromContract extends Proposal {}

export interface AugmentedBidFromContract
  extends CamelCaseKeys<BidFromContract> {
  tributes: TributeWithUSDValue[]
}

export interface BackendData {
  bidsByRoundId: Map<number, AugmentedBidFromContract[]>
  bidDescriptionsByBidId: Record<string, BidDescription>
  preHydroBids: SanitizedBidFromNumia[]
  currentRoundMetadata: {
    roundEnd: Date
    roundId: number
    tranches: Tranche[]
  }
  globalMetadata: {
    assetListWithPrices: Map<string, AssetListEntry>
    atomPrice: number
    totalLockedTokens: number
    maxLockedTokens: number
    metrics: SanitizedMetricsFromNumia[]
  }
}

export interface TributeWithUSDValue extends CamelCaseKeys<Tribute> {
  funds: CamelCaseKeys<Coin> & {
    valueInUSD: number
  }
}

export async function fetchBackendDataWithoutAddress(): Promise<BackendData> {
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
    bidDescriptionsByBidId,
    metrics,
  ] = await Promise.all([
    hydroQueryClient.constants(),
    hydroQueryClient.currentRound(),
    hydroQueryClient.tranches(),
    hydroQueryClient.totalLockedTokens(),
    fetchAssetListWithPrices(),
    fetchNumiaBidData(),
    fetchBidDescriptionsById(),
    fetchNumiaMetricsData(),
  ])

  const atomPrice =
    assetListWithPrices.get(
      "ibc/C4CFF46FD6DE35CA4CF4CE031E643C8FDC9BA4B99AE598E9B0ED98FE3A2319F9"
    )?.priceUsd ?? 0

  const bidsByRoundId = new Map<number, AugmentedBidFromContract[]>()

  // With currentRoundId, we can fetch all bids for all rounds
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

          // Fetch tributes for all bids
          const tributes = (
            await Promise.all(
              bids.map((bid) =>
                fetchProposalTributes(roundId, tranche.id, bid.proposal_id)
              )
            )
          )
            .flat()
            .map(keysFromSnakeToCamelCase)
            .map((tribute) => {
              const assetPrice =
                assetListWithPrices.get(tribute.funds.denom)?.priceUsd ?? 0

              return {
                ...tribute,
                funds: {
                  ...tribute.funds,
                  valueInUSD: Number(tribute.funds.amount) * assetPrice,
                },
              }
            })

          const sanitizedBidsWithTributes = bids
            .map(keysFromSnakeToCamelCase)
            .map((bid) => ({
              ...bid,
              description:
                bidDescriptionsByBidId[bid.proposalId]?.description ??
                bid.description,
              title: bidDescriptionsByBidId[bid.proposalId]?.title ?? bid.title,
              tributes: tributes.filter(
                (tribute) =>
                  Number(tribute.proposalId) === Number(bid.proposalId)
              ),
            }))

          if (!bidsByRoundId.has(roundId)) {
            bidsByRoundId.set(roundId, [])
          }

          bidsByRoundId.get(roundId)?.push(...sanitizedBidsWithTributes)
        })
      )
    )
  )

  return {
    bidDescriptionsByBidId,
    bidsByRoundId,
    preHydroBids,
    currentRoundMetadata: {
      roundEnd: new Date(currentRoundEnd),
      roundId: currentRoundId,
      tranches,
    },
    globalMetadata: {
      assetListWithPrices,
      atomPrice,
      maxLockedTokens: constants.max_locked_tokens,
      totalLockedTokens,
      metrics,
    },
  }
}
