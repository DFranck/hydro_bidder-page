"use server"

import { fetchAssetListWithPrices } from "@/contract-apis/fetchAssetListWithPrices"
import { fetchBidMetaDataById } from "@/contract-apis/fetchBidMetaDataById"
import { fetchNumiaBidData } from "@/contract-apis/fetchNumiaBidData"
import { fetchNumiaMetricsData } from "@/contract-apis/fetchNumiaMetricsData"
import { RawExternalData } from "@/contract-apis/types"

export async function fetchExternalData({
  numiaCosmosHydroAppApiKey,
  numiaDeploymentsOverviewEndpoint,
  numiaMetricsEndpoint,
}: {
  numiaCosmosHydroAppApiKey: string
  numiaDeploymentsOverviewEndpoint: string
  numiaMetricsEndpoint: string
}): Promise<RawExternalData> {
  const [assetListWithPrices, bidMetaDataById, numiaBids, numiaMetrics] =
    await Promise.all([
      fetchAssetListWithPrices(),
      fetchBidMetaDataById(),
      fetchNumiaBidData({
        numiaCosmosHydroAppApiKey,
        numiaDeploymentsOverviewEndpoint,
      }),
      fetchNumiaMetricsData({
        numiaCosmosHydroAppApiKey,
        numiaMetricsEndpoint,
      }),
    ])

  return {
    assetListWithPrices,
    bidMetaDataById,
    numiaBids,
    numiaMetrics,
  }
}
