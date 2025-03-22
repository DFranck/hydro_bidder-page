import { Config } from "@netlify/functions"
import { getSupabaseNamespacedFilename } from "../lib/getSupabaseNamespacedFilename"
import { supabase } from "../lib/supabase"
import { fetchHydroMetaData } from "./scheduled-build-hydro-round-data-in-background/_fetchers/fetchHydroMetaData"

export default async function () {
  console.log("Building hydro meta data...")

  const hydroMetaData = await fetchHydroMetaData()

  const filename = getSupabaseNamespacedFilename("raw-hydro-meta-data.json")

  console.log(`Writing data to Supabase storage: ${filename}`)

  await supabase.storage
    .from("raw-backend-data")
    .upload(filename, JSON.stringify(hydroMetaData), {
      upsert: true,
    })

  console.log("Hydro meta data build completed successfully")
}

export const config: Config = {
  schedule: "* * * * *", // every minute
}
