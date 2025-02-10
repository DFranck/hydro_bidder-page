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
import { fetchBids as fetchBidsBeforeWallet } from "@/contract-apis/fetchBidsBeforeWallet"
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
import groupBy from "lodash/groupBy"
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
}

export interface BackendDataBeforeWallet {
  assetListWithPrices: Record<string, AssetListEntry>
  atomPrice: number
  bidDescriptionsByBidId: Record<string, BidDescription>
  bids: AugmentedBidFromContract[]
  bidsById: Record<number, AugmentedBidFromContract>
  bidsByRoundId: Record<number, AugmentedBidFromContract[]>
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

async function measurePromiseTime<T>(
  promise: Promise<T>,
  label: string
): Promise<T> {
  const start = performance.now()
  const result = await promise
  const end = performance.now()

  if (process.env.NODE_ENV === "development") {
    console.log(`${label} took ${(end - start).toFixed(2)}ms`)
  }

  return result
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
    measurePromiseTime(hydroQueryClient.constants(), "constants"),
    measurePromiseTime(hydroQueryClient.currentRound(), "currentRound"),
    measurePromiseTime(hydroQueryClient.tranches(), "tranches"),
    measurePromiseTime(fetchAssetListWithPrices(), "assetListWithPrices"),
    measurePromiseTime(fetchNumiaBidData(), "numiaBidData"),
    measurePromiseTime(fetchBidDescriptionsById(), "bidDescriptions"),
    measurePromiseTime(fetchNumiaMetricsData(), "numiaMetrics"),
    measurePromiseTime(fetchGlobalLockupCapacity(), "globalLockupCapacity"),
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

  const bidsByRoundId = groupBy(bids, "roundId")

  const bidsById = keyBy(bids, "id")

  const backendDataBeforeWallet: BackendDataBeforeWallet = {
    assetListWithPrices,
    atomPrice,
    bidDescriptionsByBidId,
    bids,
    bidsById,
    bidsByRoundId,
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
