import "@netlify/functions"
import { Config } from "@netlify/functions"
import { fetchAssetListWithPrices } from "../contract-apis/fetchAssetListWithPrices"
import { fetchBidMetaDataById } from "../contract-apis/fetchBidMetaDataById"
import { fetchNumiaBidData } from "../contract-apis/fetchNumiaBidData"
import { fetchNumiaMetricsData } from "../contract-apis/fetchNumiaMetricsData"
import { RawExternalData } from "../contract-apis/types"
import { supabase } from "../lib/supabase"

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

  console.log(`Writing data to Supabase storage...`)

  await supabase.storage
    .from("raw-backend-data")
    .upload("raw-external-data.json", JSON.stringify(rawExternalData), {
      upsert: true,
    })

  console.log("External data build completed successfully")
}

export const config: Config = {
  schedule: "* * * * *", // every minute
}
