"use server"

import { fetchAssetListWithPrices } from "@/contract-apis/fetchAssetListWithPrices"
import { fetchBidDescriptionsById } from "@/contract-apis/fetchBidDescriptions"
import { fetchNumiaBidData } from "@/contract-apis/fetchNumiaBidData"
import { fetchNumiaMetricsData } from "@/contract-apis/fetchNumiaMetricsData"

export async function fetchExternalData() {
  const [assetListWithPrices, numiaData, bidDescriptionsByBidId, metrics] =
    await Promise.all([
      fetchAssetListWithPrices(),
      fetchNumiaBidData(),
      fetchBidDescriptionsById(),
      fetchNumiaMetricsData(),
    ])

  return {
    assetListWithPrices,
    numiaData,
    bidDescriptionsByBidId,
    metrics,
  }
}
