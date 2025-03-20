import { getStore } from "@netlify/blobs"
import "@netlify/functions"
import { Config } from "@netlify/functions"
import { fetchAssetListWithPrices } from "../contract-apis/fetchAssetListWithPrices"
import { fetchBidMetaDataById } from "../contract-apis/fetchBidMetaDataById"
import { fetchNumiaBidData } from "../contract-apis/fetchNumiaBidData"
import { fetchNumiaMetricsData } from "../contract-apis/fetchNumiaMetricsData"
import { getEnvironmentVariable } from "../contract-apis/getEnvironmentVariable"
import { RawExternalData } from "../contract-apis/types"

export default async function () {
  console.log("Building external data...")

  const [assetListWithPrices, bidMetaDataById, numiaBids, numiaMetrics] =
    await Promise.all([
      fetchAssetListWithPrices(),
      fetchBidMetaDataById(),
      fetchNumiaBidData(),
      fetchNumiaMetricsData(),
    ])

  const rawExternalData: RawExternalData = {
    assetListWithPrices,
    bidMetaDataById,
    numiaBids,
    numiaMetrics,
  }

  console.log(`Writing data to Netlify Blob storage...`)

  const store = getStore({
    name: "raw-data",
    consistency: "eventual",
    siteID: getEnvironmentVariable("NETLIFY_SITE_ID"),
    token: getEnvironmentVariable("NETLIFY_API_TOKEN"),
  })

  await store.setJSON("raw-external-data", rawExternalData, {
    metadata: {
      buildTime: Date.now(),
    },
  })

  console.log("External data build completed successfully")
}

export const config: Config = {
  schedule: "* * * * *", // every minute
}
