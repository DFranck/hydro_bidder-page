"use server"

import { HydroBaseQueryClient } from "@/app/ts_types/HydroBase.client"
import { Coin, Proposal, Tranche } from "@/app/ts_types/HydroBase.types"
import { Tribute } from "@/app/ts_types/TributeBase.types"
import { fetchAssetListWithPrices } from "@/contract-apis/fetchAssetListWithPrices"
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
  extends Omit<CamelCaseKeys<BidFromContract>, "percentage" | "proposalId"> {
  id: string
  percentage: number
  tributes: AugmentedTribute[]
}

export interface BackendData {
  bidsByRoundId: Record<number, AugmentedBidFromContract[]>
  bidDescriptionsByBidId: Record<string, BidDescription>
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
    metrics: SanitizedMetricsFromNumia
  }
}

export interface AugmentedTribute
  extends Omit<CamelCaseKeys<Tribute>, "funds">,
    Omit<CamelCaseKeys<Coin>, "amount"> {
  amount: number
  valueInUsd: number
  isTokenBased: boolean
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

  const bidsByRoundId: Record<number, AugmentedBidFromContract[]> = {}

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
            .map(({ funds, ...tribute }) => {
              const assetListing = assetListWithPrices.get(funds.denom)
              const assetPrice = assetListing?.priceUsd ?? 0
              const decimals = assetListing?.decimals ?? 6

              return {
                ...tribute,
                ...funds,
                valueInUsd:
                  (parseFloat(funds.amount) / 10 ** decimals) * assetPrice,
              }
            })

          // Add tributes to every bid
          const sanitizedBidsWithTributes = bids
            .map(keysFromSnakeToCamelCase)
            .map(({ proposalId, ...bid }) => ({
              ...bid,
              id: String(proposalId),
              description:
                bidDescriptionsByBidId[proposalId]?.description ??
                bid.description,
              percentage: Number(bid.percentage),
              title: bidDescriptionsByBidId[proposalId]?.title ?? bid.title,
              tributes: tributes
                .filter(
                  (tribute) => Number(tribute.proposalId) === Number(proposalId)
                )
                .map((tribute) => {
                  const isTokenBased =
                    !bidDescriptionsByBidId[proposalId]?.points?.[0]

                  return {
                    ...tribute,
                    amount: Number(tribute.amount),
                    isTokenBased,
                  }
                }),
            }))

          if (!(roundId in bidsByRoundId)) {
            bidsByRoundId[roundId] = []
          }

          bidsByRoundId[roundId].push(...sanitizedBidsWithTributes)
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
      atomPrice,
      maxLockedTokens: constants.max_locked_tokens,
      totalLockedTokens,
      metrics,
    },
  }
}
