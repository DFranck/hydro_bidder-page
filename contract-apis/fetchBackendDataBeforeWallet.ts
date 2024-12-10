"use server"

import { HydroBaseQueryClient } from "@/app/ts_types/HydroBase.client"
import { Proposal, Tranche } from "@/app/ts_types/HydroBase.types"
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
  augmentLiquidityDeployment,
  fetchLiquidityDeployments,
  SanitizedLiquidityDeployment,
} from "@/contract-apis/fetchLiquidityDeployments"
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
import { groupBy, keyBy, range } from "lodash"
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
  liquidityDeployment: SanitizedLiquidityDeployment | null
  percentage: number
  tributes: (SanitizedTokenBasedTribute | SanitizedPointBasedTribute)[]
}

export interface BackendDataBeforeWallet {
  assetListWithPrices: Map<string, AssetListEntry>
  atomPrice: number
  bidDescriptionsByBidId: Record<string, BidDescription>
  bids: AugmentedBidFromContract[]
  bidsByRoundId: Record<number, AugmentedBidFromContract[]>
  bidsById: Record<number, AugmentedBidFromContract>
  currentRoundEndDate: Date
  currentRoundId: number
  currentRoundIsPilot: boolean
  currentRoundTranches: Tranche[]
  lockedAtomIsAtGlobalCapacity: boolean
  lockupEpochLength: number
  lockedAtomPercentageGlobal: number
  lockedAtomMaxGlobal: number
  metricsForPostHydroBids: SanitizedBidFromNumia[]
  metricsForPreHydroBids: SanitizedBidFromNumia[]
  metricsGlobal: SanitizedMetricsFromNumia
  lockedAtomTotalGlobal: number
}

export type SanitizedTokenBasedTribute = Omit<
  CamelCaseKeys<Tribute>,
  "funds" | "proposalId" | "tributeId"
> & {
  id: number
  amount: number
  bidId: number
  denom: string
  valueInUsd: number
  isTokenBased: true
}

export type SanitizedPointBasedTribute = {
  amount: number
  bidId: number
  denom: string
  isTokenBased: false
  roundId: number
  trancheId: number
  valueInUsd: number
}

async function uncachedFetchBackendDataBeforeWallet(): Promise<BackendDataBeforeWallet> {
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
        lock_epoch_length: lockupEpochLength,
        max_locked_tokens: lockedAtomMaxGlobal,
      },
    },
    { round_id: currentRoundId },
    { tranches },
    { total_locked_tokens: lockedAtomTotalGlobal },
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

  const { round_end } = await hydroQueryClient.roundEnd({
    roundId: currentRoundId,
  })

  const currentRoundEndDate = new Date(Number(round_end) / 1e6)

  const lockedAtomPercentageGlobal = Math.round(
    (lockedAtomTotalGlobal / lockedAtomMaxGlobal) * 100
  )

  const lockedAtomIsAtGlobalCapacity = lockedAtomPercentageGlobal === 100

  // [0, 1, 2, ...currentRoundId]
  const allRoundIds = range(0, currentRoundId + 1)

  const bids: AugmentedBidFromContract[] = (
    await Promise.all(
      allRoundIds.map((roundId) =>
        Promise.all(
          tranches.map(async (tranche) => {
            const { proposals: unsanitizedBids } =
              await hydroQueryClient.roundProposals({
                limit: 50,
                roundId,
                startFrom: 0,
                trancheId: tranche.id,
              })

            const topNProposals = await hydroQueryClient.topNProposals({
              numberOfProposals: 50,
              roundId,
              trancheId: tranche.id,
            })

            const sanitizedTokenBasedTributes: SanitizedTokenBasedTribute[] = (
              await Promise.all(
                unsanitizedBids.map((bid) =>
                  fetchProposalTributes(roundId, tranche.id, bid.proposal_id)
                )
              )
            )
              .flat()
              .map(keysFromSnakeToCamelCase)
              .map(({ funds, proposalId, tributeId, ...tribute }) => {
                const assetListing = assetListWithPrices.get(funds.denom)
                const assetPrice = assetListing?.priceUsd ?? 0
                const decimals = assetListing?.decimals ?? 6
                const amount = parseFloat(funds.amount) / 10 ** decimals

                return {
                  ...tribute,
                  ...funds,
                  id: tributeId,
                  amount,
                  bidId: proposalId,
                  denom: assetListing?.symbol ?? funds.denom,
                  isTokenBased: true as const,
                  valueInUsd:
                    (parseFloat(funds.amount) / 10 ** decimals) * assetPrice,
                }
              })
              .filter((tribute) => tribute.amount > 1)

            const sanitizedPointBasedTributes: SanitizedPointBasedTribute[] =
              unsanitizedBids
                .map((bid) => {
                  const bidDescription = bidDescriptionsByBidId[bid.proposal_id]

                  if (!bidDescription) {
                    return null
                  }

                  const hasPoints =
                    bidDescription.points &&
                    Array.isArray(bidDescription.points)

                  if (!hasPoints) {
                    return null
                  }

                  const [amount, denom] = bidDescription.points!
                  const assetListing = assetListWithPrices.get(denom)
                  const assetPrice = assetListing?.priceUsd ?? 0
                  const decimals = assetListing?.decimals ?? 6

                  return {
                    amount,
                    bidId: bid.proposal_id,
                    denom,
                    isTokenBased: false as const,
                    roundId,
                    trancheId: tranche.id,
                    valueInUsd: (amount / 10 ** decimals) * assetPrice,
                  }
                })
                .filter((b) => b !== null)

            const liquidityDeployments =
              (await fetchLiquidityDeployments({
                roundId,
                trancheId: tranche.id,
              })) ?? []

            const augmentedLiquidityDeployments = liquidityDeployments.map(
              (liquidityDeployment) =>
                augmentLiquidityDeployment({
                  assetListWithPrices,
                  liquidityDeployment,
                })
            )

            // Add tributes and liquidity deployments to every bid
            const augmentedBids = unsanitizedBids
              .map(keysFromSnakeToCamelCase)
              .map(({ deploymentDuration, proposalId, ...bid }) => {
                const matchingTopProposal = topNProposals.proposals.find(
                  (topProposal) => topProposal.proposal_id === proposalId
                )
                const bidDescription = bidDescriptionsByBidId[proposalId]
                const description =
                  bidDescription?.description ?? bid.description
                const title = bidDescription?.title ?? bid.title
                const bidTributes = [
                  ...sanitizedTokenBasedTributes,
                  ...sanitizedPointBasedTributes,
                ].filter((tribute) => tribute.bidId === proposalId)
                const liquidityDeployment =
                  augmentedLiquidityDeployments.find(
                    (deployment) => deployment.bidId === proposalId
                  ) ?? null

                return {
                  ...bid,
                  id: proposalId,
                  deploymentDurationInEpochs: deploymentDuration,
                  deploymentDurationInNanos:
                    deploymentDuration * lockupEpochLength,
                  description,
                  liquidityDeployment,
                  percentage: matchingTopProposal
                    ? Number(matchingTopProposal.percentage)
                    : Number(bid.percentage),
                  title,
                  tributes: bidTributes,
                }
              })

            return augmentedBids
          })
        )
      )
    )
  )
    .flat()
    .flat()

  const bidsByRoundId = groupBy(bids, "roundId")

  const bidsById = keyBy(bids, "id")

  const backendDataBeforeWallet: BackendDataBeforeWallet = {
    assetListWithPrices,
    atomPrice,
    bidDescriptionsByBidId,
    bids,
    bidsByRoundId,
    bidsById,
    currentRoundEndDate,
    currentRoundId,
    currentRoundIsPilot: true,
    currentRoundTranches: tranches,
    lockedAtomIsAtGlobalCapacity,
    lockupEpochLength,
    lockedAtomMaxGlobal,
    metricsGlobal: metrics,
    metricsForPreHydroBids: preHydroBids,
    metricsForPostHydroBids: postHydroBids,
    lockedAtomPercentageGlobal,
    lockedAtomTotalGlobal,
  }

  return backendDataBeforeWallet
}

export const fetchBackendDataBeforeWallet = unstable_cache(
  uncachedFetchBackendDataBeforeWallet,
  undefined,
  {
    revalidate: 60 * 5, // 5 minutes
    tags: ["backendData"],
  }
)
