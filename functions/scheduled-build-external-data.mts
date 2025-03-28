import { Config } from "@netlify/functions"
import { fetchAssetListWithPrices } from "../contract-apis/fetchAssetListWithPrices"
import { fetchBidMetaDataById } from "../contract-apis/fetchBidMetaDataById"
import { fetchNumiaBidData } from "../contract-apis/fetchNumiaBidData"
import { fetchNumiaMetricsData } from "../contract-apis/fetchNumiaMetricsData"
import { RawExternalData } from "../contract-apis/types"
import { getSupabaseNamespacedFilename } from "../lib/getSupabaseNamespacedFilename"
import { supabase } from "../lib/supabase"

export const config: Config = {
  schedule: "* * * * *", // every minute
}

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

  const filename = getSupabaseNamespacedFilename("raw-external-data.json")

  console.log(`Writing data to Supabase storage: ${filename}`)

  await supabase.storage
    .from("raw-backend-data")
    .upload(filename, JSON.stringify(rawExternalData), {
      upsert: true,
    })

  console.log("External data build completed successfully")
}
