import { Config } from "@netlify/functions"
import { fetchBidMetaDataById } from "../contract-apis/fetchBidMetaDataById"
import { fetchNumiaMetricsData } from "../contract-apis/fetchNumiaMetricsData"
import { RawExternalData } from "../contract-apis/types"
import { getSupabaseNamespacedFilename } from "../lib/getSupabaseNamespacedFilename"
import { supabase } from "../lib/supabase"
import { fetchPreHydroBidData } from "@/contract-apis/fetchPreHydroBidData"

export const config: Config = {
  schedule: "* * * * *", // every minute
}

export default async function () {
  console.log("Building external data...")

  const [bidMetaDataById, preHydroBids, numiaMetrics] =
    await Promise.all([
      fetchBidMetaDataById(),
      fetchPreHydroBidData(),
      fetchNumiaMetricsData(),
    ])

  const rawExternalData: RawExternalData = {
    bidMetaDataById,
    preHydroBids,
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
