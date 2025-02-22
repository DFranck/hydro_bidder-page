"use server"

import { fetchAssetListWithPrices } from "@/contract-apis/fetchAssetListWithPrices"
import { fetchBidDescriptionsById } from "@/contract-apis/fetchBidDescriptions"
import { fetchNumiaBidData } from "@/contract-apis/fetchNumiaBidData"
import { fetchNumiaMetricsData } from "@/contract-apis/fetchNumiaMetricsData"

export async function fetchExternalData() {
  const [assetListWithPrices, bidDescriptionsByBidId, numiaBids, numiaMetrics] =
    await Promise.all([
      fetchAssetListWithPrices(),
      fetchBidDescriptionsById(),
      fetchNumiaBidData(),
      fetchNumiaMetricsData(),
    ])

  return {
    assetListWithPrices,
    bidDescriptionsByBidId,
    numiaBids,
    numiaMetrics,
  }
}
