import { Config } from "@netlify/functions"
import { getSupabaseNamespacedFilename } from "@/lib/getSupabaseNamespacedFilename"
import { supabase } from "@/lib/supabase"
import { fetchHydroListings } from "./scheduled-build-hydro-round-data-in-background/_fetchers/fetchHydroListings"

export const config: Config = {
  schedule: "* * * * *", // every minute
}

export default async function () {
  console.log("Building hydro listings...")

  const hydroListings = await fetchHydroListings()

  const hydroListingsFilename = getSupabaseNamespacedFilename(
    "raw-hydro-listings.json",
  )

  await supabase.storage
    .from("raw-backend-data")
    .upload(hydroListingsFilename, JSON.stringify(hydroListings), {
      upsert: true,
    })

  console.log("Hydro listings build completed successfully")
}
