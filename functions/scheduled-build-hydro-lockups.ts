import { Config } from "@netlify/functions"
import { getSupabaseNamespacedFilename } from "@/lib/getSupabaseNamespacedFilename"
import { supabase } from "@/lib/supabase"
import { fetchHydroLockups } from "./scheduled-build-hydro-round-data-in-background/_fetchers/fetchHydroLockups"

export const config: Config = {
  schedule: "*/5 * * * *", // every 5 minutes
}

export default async function () {
  console.log("Building hydro lockups...")

  const hydroLockups = await fetchHydroLockups()

  const hydroLockupsFilename = getSupabaseNamespacedFilename(
    "raw-hydro-lockups.json",
  )

  await supabase.storage
    .from("raw-backend-data")
    .upload(hydroLockupsFilename, JSON.stringify(hydroLockups), {
      upsert: true,
    })

  console.log("Hydro lockups build completed successfully")
}
