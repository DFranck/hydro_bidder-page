"use server"

import { BackendDataBeforeWallet } from "@/contract-apis/types"
import { getSupabaseNamespacedFilename } from "@/lib/getSupabaseNamespacedFilename"
import { unstable_cache } from "next/cache"

const supabaseEndpoint =
  "https://qqhhwjgeottahfasjzht.supabase.co/storage/v1/object/public/raw-backend-data/"

async function uncachedFetchBackendDataBeforeWallet(): Promise<BackendDataBeforeWallet> {
  if (process.env.NODE_ENV === "development") {
    const decorativeCharacter = "%"
    const message = `${decorativeCharacter.repeat(3)} LOADING SUPABASE DATA FOR "${process.env.NEXT_PUBLIC_SUPABASE_DATA_NAMESPACE}" ${decorativeCharacter.repeat(3)}`
    console.log(decorativeCharacter.repeat(message.length))
    console.log(message)
    console.log(decorativeCharacter.repeat(message.length))
  }

  const [
    rawHydroRoundData,
    rawHydroMetaData,
    rawExternalData,
    rawHydroLockups,
    rawHydroListings,
  ] = await Promise.all(
    [
      "raw-hydro-round-data.json",
      "raw-hydro-meta-data.json",
      "raw-external-data.json",
      "raw-hydro-lockups.json",
      "raw-hydro-listings.json",
    ].map((filename) =>
      fetch(
        [
          supabaseEndpoint,
          getSupabaseNamespacedFilename(filename),
          `?time=${new Date().getTime()}`,
        ].join(""),
      ).then((res) => res.json()),
    ),
  )

  return {
    hydroRoundData: rawHydroRoundData,
    hydroMetaData: rawHydroMetaData,
    externalData: rawExternalData,
    hydroLockups: rawHydroLockups,
    hydroListings: rawHydroListings,
  }
}

export const fetchBackendDataBeforeWallet = unstable_cache(
  uncachedFetchBackendDataBeforeWallet,
  ["fetchBackendDataBeforeWallet"],
  {
    revalidate: 60 * 5,
    tags: ["backendData"],
  },
)
