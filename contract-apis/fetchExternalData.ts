"use server"

import { fetchAssetListWithPrices } from "@/contract-apis/fetchAssetListWithPrices"
import { fetchBidMetaDataById } from "@/contract-apis/fetchBidMetaDataById"
import { fetchNumiaBidData } from "@/contract-apis/fetchNumiaBidData"
import { fetchNumiaMetricsData } from "@/contract-apis/fetchNumiaMetricsData"
import { RawExternalData } from "@/contract-apis/types"

export async function fetchExternalData(): Promise<RawExternalData> {
  const [assetListWithPrices, bidMetaDataById, numiaBids, numiaMetrics] =
    await Promise.all([
      fetchAssetListWithPrices(),
      fetchBidMetaDataById(),
      fetchNumiaBidData(),
      fetchNumiaMetricsData(),
    ])

  return {
    assetListWithPrices,
    bidMetaDataById,
    numiaBids,
    numiaMetrics,
  }
}
