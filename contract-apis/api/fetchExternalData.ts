"use server"

import { fetchAssetListWithPrices } from "@/contract-apis/fetchAssetListWithPrices"
import { fetchBidDescriptionsById } from "@/contract-apis/fetchBidDescriptions"
import { fetchGlobalLockupCapacity } from "@/contract-apis/fetchGlobalLockupCapacity"
import { fetchNumiaBidData } from "@/contract-apis/fetchNumiaBidData"
import { fetchNumiaMetricsData } from "@/contract-apis/fetchNumiaMetricsData"

export async function fetchExternalData() {
  const [
    assetListWithPrices,
    numiaData,
    bidDescriptionsByBidId,
    metrics,
    globalLockupCapacityInfo,
  ] = await Promise.all([
    fetchAssetListWithPrices(),
    fetchNumiaBidData(),
    fetchBidDescriptionsById(),
    fetchNumiaMetricsData(),
    fetchGlobalLockupCapacity(),
  ])

  return {
    assetListWithPrices,
    numiaData,
    bidDescriptionsByBidId,
    metrics,
    globalLockupCapacityInfo,
  }
}
