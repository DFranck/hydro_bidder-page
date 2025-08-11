import { fetchHydroMetaData } from "@/functions/scheduled-build-hydro-round-data-in-background/_fetchers/fetchHydroMetaData"
import { createClient } from "@supabase/supabase-js"
import { writeFile } from "fs/promises"
import { join } from "path"
import { fileURLToPath } from "url"
import { fetchHydroListings } from "../functions/scheduled-build-hydro-round-data-in-background/_fetchers/fetchHydroListings"
import { fetchHydroLockups } from "../functions/scheduled-build-hydro-round-data-in-background/_fetchers/fetchHydroLockups"

// npx tsx scripts\build-moonkitt-dev--.ts

export default async function scheduledBuildHydroLockups() {
  console.log("Building hydro lockups and listings...")

  const hydroLockups = await fetchHydroLockups()
  const hydroListings = await fetchHydroListings()
  const hydroMetaData = await fetchHydroMetaData()
  // const hydroRoundData = await fetchHydroRoundsData()

  // Write to local files
  const lockupsPath = join(process.cwd(), "public/data/raw-hydro-lockups.json")
  await writeFile(lockupsPath, JSON.stringify(hydroLockups, null, 2), "utf-8")
  const listingsPath = join(
    process.cwd(),
    "public/data/raw-hydro-listings.json",
  )
  await writeFile(listingsPath, JSON.stringify(hydroListings, null, 2), "utf-8")
  const metaDataPath = join(
    process.cwd(),
    "public/data/raw-hydro-meta-data.json",
  )
  await writeFile(metaDataPath, JSON.stringify(hydroMetaData, null, 2), "utf-8")

  // Upload to Supabase
  const hydroLockupsFilename = "moonkitt-dev--raw-hydro-lockups.json"
  const hydroListingsFilename = "moonkitt-dev--raw-hydro-listings.json"
  const hydroMetaDataFilename = "moonkitt-dev--raw-hydro-meta-data.json"
  const hydroRoundDataFilename = "moonkitt-dev--raw-hydro-round-data.json"

  const supabaseUrl = "https://qqhhwjgeottahfasjzht.supabase.co"
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseKey) throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY in env")
  const supabase = createClient(supabaseUrl, supabaseKey)

  const { error: metaDataUploadError } = await supabase.storage
    .from("raw-backend-data")
    .upload(hydroMetaDataFilename, JSON.stringify(hydroMetaData), {
      upsert: true,
    })

  if (metaDataUploadError) {
    console.error(
      "[API] Failed to upload hydroMetaData to Supabase:",
      metaDataUploadError,
    )
  } else {
    console.log("[API] Successfully uploaded hydroMetaData to Supabase")
  }

  // const { error: roundDataUploadError } = await supabase.storage
  //   .from("raw-backend-data")
  //   .upload(hydroRoundDataFilename, JSON.stringify(hydroRoundData), {
  //     upsert: true,
  //   })

  // if (roundDataUploadError) {
  //   console.error(
  //     "[API] Failed to upload hydroRoundData to Supabase:",
  //     roundDataUploadError,
  //   )
  // } else {
  //   console.log("[API] Successfully uploaded hydroRoundData to Supabase")
  // }
  const { error: lockupsUploadError } = await supabase.storage
    .from("raw-backend-data")
    .upload(hydroLockupsFilename, JSON.stringify(hydroLockups), {
      upsert: true,
    })

  if (lockupsUploadError) {
    console.error(
      "[API] Failed to upload hydroLockups to Supabase:",
      lockupsUploadError,
    )
    throw lockupsUploadError
  } else {
    console.log("[API] Successfully uploaded hydroLockups to Supabase")
  }
  const { error: listingsUploadError } = await supabase.storage
    .from("raw-backend-data")
    .upload(hydroListingsFilename, JSON.stringify(hydroListings), {
      upsert: true,
    })

  if (listingsUploadError) {
    console.error(
      "[API] Failed to upload hydroListings to Supabase:",
      listingsUploadError,
    )
    throw listingsUploadError
  } else {
    console.log("[API] Successfully uploaded hydroListings to Supabase")
  }

  console.log("ALl data build completed successfully")
}

if (
  process.env.NODE_ENV !== "production" &&
  fileURLToPath(import.meta.url) === process.argv[1]
) {
  scheduledBuildHydroLockups()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err)
      process.exit(1)
    })
}
