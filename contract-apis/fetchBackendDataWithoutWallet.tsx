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
import { unstable_cache } from "next/dist/server/web/spec-extension/unstable-cache"

export interface BidFromContract extends Proposal {}

export interface AugmentedBidFromContract
  extends Omit<
    CamelCaseKeys<BidFromContract>,
    "deploymentDuration" | "percentage" | "proposalId"
  > {
  id: number
  deploymentDurationInEpochs: number
  deploymentDurationInNanos: number
  percentage: number
  tributes: AugmentedTribute[]
}

export interface BackendData {
  atomPrice: number
  bidDescriptionsByBidId: Record<string, BidDescription>
  bidsByRoundId: Record<number, AugmentedBidFromContract[]>
  currentRoundEndDate: Date
  currentRoundId: number
  currentRoundIsPilot: boolean
  currentRoundTranches: Tranche[]
  lockupEpochLength: number
  maxLockedAtomGlobal: number
  metricsForPostHydroBids: SanitizedBidFromNumia[]
  metricsForPreHydroBids: SanitizedBidFromNumia[]
  metricsGlobal: SanitizedMetricsFromNumia
  totalLockedAtomGlobal: number
}

export interface AugmentedTribute
  extends Omit<CamelCaseKeys<Tribute>, "funds">,
    Omit<CamelCaseKeys<Coin>, "amount"> {
  amount: number
  valueInUsd: number
  isTokenBased: boolean
}

async function uncachedFetchBackendDataWithoutAddress(): Promise<BackendData> {
  if (!process.env.NEXT_PUBLIC_HYDRO_CONTRACT_ADDRESS) {
    throw new Error("Hydro contract address not set")
  }

  const client = await getCosmWasmClient()

  const hydroQueryClient = new HydroBaseQueryClient(
    client,
    process.env.NEXT_PUBLIC_HYDRO_CONTRACT_ADDRESS
  )

  const [
    {
      constants: {
        is_in_pilot_mode: currentRoundIsPilot,
        lock_epoch_length: lockupEpochLength,
        max_locked_tokens: maxLockedAtomGlobal,
      },
    },
    { round_id: currentRoundId },
    { tranches },
    { total_locked_tokens: totalLockedAtomGlobal },
    assetListWithPrices,
    { preHydroBids, postHydroBids },
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

  const { round_end } = await hydroQueryClient.roundEnd({
    roundId: currentRoundId,
  })

  const currentRoundEndDate = new Date(Number(round_end) / 1e6)

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
            .map(({ deploymentDuration, proposalId, ...bid }) => ({
              ...bid,
              id: proposalId,
              deploymentDurationInEpochs: deploymentDuration,
              deploymentDurationInNanos: deploymentDuration * lockupEpochLength,
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
    atomPrice,
    bidDescriptionsByBidId,
    bidsByRoundId,
    currentRoundEndDate,
    currentRoundId,
    currentRoundIsPilot,
    currentRoundTranches: tranches,
    lockupEpochLength: lockupEpochLength,
    maxLockedAtomGlobal,
    metricsGlobal: metrics,
    metricsForPreHydroBids: preHydroBids,
    metricsForPostHydroBids: postHydroBids,
    totalLockedAtomGlobal,
  }
}

export const fetchBackendDataWithoutAddress = unstable_cache(
  uncachedFetchBackendDataWithoutAddress,
  ["fetchBackendDataWithoutAddress"],
  {
    revalidate: 60 * 5, // 5 minutes
  }
)
