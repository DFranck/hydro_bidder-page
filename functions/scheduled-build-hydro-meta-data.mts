import "@netlify/functions"
import { Config } from "@netlify/functions"
import { supabase } from "../lib/supabase"
import { fetchHydroMetaData } from "./scheduled-build-hydro-round-data-in-background/_fetchers/fetchHydroMetaData"

export default async function () {
  console.log("Building hydro meta data...")

  const hydroMetaData = await fetchHydroMetaData()

  console.log(`Writing data to Supabase storage...`)

  await supabase.storage
    .from("raw-backend-data")
    .upload("raw-hydro-meta-data.json", JSON.stringify(hydroMetaData), {
      upsert: true,
    })

  console.log("Hydro meta data build completed successfully")
}

export const config: Config = {
  schedule: "* * * * *", // every minute
}
