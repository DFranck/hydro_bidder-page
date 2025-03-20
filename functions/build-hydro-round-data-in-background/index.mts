import { Context } from "@netlify/functions"
import { supabase } from "../../lib/supabase"
import { fetchHydroRoundsData } from "./_fetchers/fetchHydroRoundsData"

export default async (req: Request, context: Context) => {
  context.log("Background function started")
  try {
    context.log("Starting data fetch...")

    const hydroRoundData = await fetchHydroRoundsData()

    context.log("Writing data to Supabase storage...")

    await supabase.storage
      .from("raw-backend-data")
      .upload("raw-hydro-round-data.json", JSON.stringify(hydroRoundData), {
        upsert: true,
      })

    context.log("Background function completed successfully")
  } catch (error) {
    context.log(`Error: ${error.message}`)
    context.log(`Stack trace: ${error.stack}`)
    console.error("Error building hydro round data:", error)
  }
}
