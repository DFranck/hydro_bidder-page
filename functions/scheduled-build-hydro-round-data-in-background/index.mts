import { Config } from "@netlify/functions"
import { getSupabaseNamespacedFilename } from "../../lib/getSupabaseNamespacedFilename"
import { supabase } from "../../lib/supabase"
import { fetchHydroRoundsData } from "./_fetchers/fetchHydroRoundsData"

export default async function () {
  try {
    console.log("Starting data fetch...")

    const hydroRoundData = await fetchHydroRoundsData()

    console.log("Writing data to Supabase storage...")

    const filename = getSupabaseNamespacedFilename("raw-hydro-round-data.json")

    console.log(`Writing data to Supabase storage: ${filename}`)

    await supabase.storage
      .from("raw-backend-data")
      .upload(filename, JSON.stringify(hydroRoundData), {
        upsert: true,
      })

    console.log("Background function completed successfully")
  } catch (error) {
    console.log(`Error: ${error.message}`)
    console.log(`Stack trace: ${error.stack}`)
    console.error("Error building hydro round data:", error)
  }
}

export const config: Config = {
  schedule: "*/10 * * * *", // every 10 minutes
}
