"use server"

import { HydroBaseQueryClient } from "@/app/ts_types/HydroBase.client"
import { Proposal, Tranche } from "@/app/ts_types/HydroBase.types"
import { Tribute } from "@/app/ts_types/TributeBase.types"
import {
  AssetListEntry,
  fetchAssetListWithPrices,
} from "@/contract-apis/fetchAssetListWithPrices"
import {
  BidDescriptionFromGithub,
  fetchBidDescriptionsById,
} from "@/contract-apis/fetchBidDescriptions"
import { fetchBidsBeforeWallet } from "@/contract-apis/fetchBidsBeforeWallet"
import { fetchGlobalLockupCapacity } from "@/contract-apis/fetchGlobalLockupCapacity"
import { SanitizedLiquidityDeployment } from "@/contract-apis/fetchLiquidityDeployments"
import {
  fetchNumiaBidData,
  SanitizedBidFromNumia,
} from "@/contract-apis/fetchNumiaBidData"
import {
  fetchNumiaMetricsData,
  SanitizedMetricsFromNumia,
} from "@/contract-apis/fetchNumiaMetricsData"
import { getCosmWasmClient } from "@/contract-apis/getCosmWasmClient"
import { CamelCaseKeys } from "@/lib/keysFromSnakeToCamelCase"
import keyBy from "lodash/keyBy"
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
  tributeApr: number
  tributeAprMax: number
  tributeAprMin: number
}

export interface BackendDataBeforeWallet {
  assetListWithPrices: Record<string, AssetListEntry>
  atomPrice: number
  bidDescriptionsByBidId: Record<string, BidDescriptionFromGithub>
  bidsById: Record<number, AugmentedBidFromContract>
  currentRoundEndDate: Date
  currentRoundId: number
  currentRoundIsPilot: boolean
  tranches: Tranche[]
  lockedAtomIsAtCapacityGlobal: boolean
  lockedAtomEpochInNanos: number
  lockedAtomMaxGlobal: number
  lockedAtomMaxWallet: number
  lockedAtomPercentageGlobal: number
  lockedAtomRemainingCapacityGlobal: number
  lockedAtomTotalGlobal: number
  metricsForPostHydroBids: SanitizedBidFromNumia[]
  metricsForPreHydroBids: SanitizedBidFromNumia[]
  metricsGlobal: SanitizedMetricsFromNumia
  minTributeFactor: number
}

export type SanitizedTokenBasedTribute = Omit<
  CamelCaseKeys<Tribute>,
  "funds" | "proposalId" | "tributeId"
> & {
  id: number
  amount: number
  bidId: number
  denom: string
  valueUsd: number
  isTokenBased: true
}

export type SanitizedPointBasedTribute = {
  amount: number
  bidId: number
  denom: string
  isTokenBased: false
  roundId: number
  trancheId: number
  valueUsd: number
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
      constants: { lock_epoch_length: lockedAtomEpochInNanos },
    },
    { round_id: currentRoundId },
    { tranches },
    assetListWithPrices,
    { preHydroBids, postHydroBids },
    bidDescriptionsByBidId,
    metrics,
    globalLockupCapacityInfo,
  ] = await Promise.all([
    hydroQueryClient.constants(),
    hydroQueryClient.currentRound(),
    hydroQueryClient.tranches(),
    fetchAssetListWithPrices(),
    fetchNumiaBidData(),
    fetchBidDescriptionsById(),
    fetchNumiaMetricsData(),
    fetchGlobalLockupCapacity(),
  ])

  const atomPrice =
    assetListWithPrices[
      "ibc/C4CFF46FD6DE35CA4CF4CE031E643C8FDC9BA4B99AE598E9B0ED98FE3A2319F9"
    ]?.priceUsd ?? 0

  const { round_end } = await hydroQueryClient.roundEnd({
    roundId: currentRoundId,
  })

  const currentRoundEndDate = new Date(Number(round_end) / 1e6)

  const bids: AugmentedBidFromContract[] = await fetchBidsBeforeWallet({
    assetListWithPrices,
    atomPrice,
    bidDescriptionsByBidId,
    currentRoundId,
    lockedAtomEpochInNanos,
    postHydroBids,
    tranches,
  })

  const bidsById = keyBy(bids, "id")

  const backendDataBeforeWallet: BackendDataBeforeWallet = {
    assetListWithPrices,
    atomPrice,
    bidDescriptionsByBidId,
    bidsById,
    currentRoundEndDate,
    currentRoundId,
    currentRoundIsPilot: true,
    lockedAtomEpochInNanos,
    lockedAtomMaxWallet: 250, // TODO: get this from contract
    metricsForPostHydroBids: postHydroBids,
    metricsForPreHydroBids: preHydroBids,
    metricsGlobal: metrics,
    minTributeFactor: 0.0001, // TODO: get this from contract
    tranches,
    ...globalLockupCapacityInfo,
  }

  return backendDataBeforeWallet
}

export const fetchBackendDataBeforeWallet = unstable_cache(
  uncachedFetchBackendDataBeforeWallet,
  ["fetchBackendDataBeforeWallet"],
  {
    revalidate: 60 * 5, // 5 minutes
    tags: ["backendData"],
  }
)
