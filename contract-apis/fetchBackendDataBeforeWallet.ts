"use server"

import { BackendDataBeforeWallet } from "@/contract-apis/types"
import { unstable_cache } from "next/cache"

async function uncachedFetchBackendDataBeforeWallet(): Promise<BackendDataBeforeWallet> {
  const [rawHydroRoundData, rawHydroMetaData, rawExternalData] =
    await Promise.all([
      fetch(
        "https://qqhhwjgeottahfasjzht.supabase.co/storage/v1/object/public/raw-backend-data/raw-hydro-round-data.json"
      ).then((res) => res.json()),
      fetch(
        "https://qqhhwjgeottahfasjzht.supabase.co/storage/v1/object/public/raw-backend-data/raw-hydro-meta-data.json"
      ).then((res) => res.json()),
      fetch(
        "https://qqhhwjgeottahfasjzht.supabase.co/storage/v1/object/public/raw-backend-data/raw-external-data.json"
      ).then((res) => res.json()),
    ])

  return Object.fromEntries(
    [
      ["hydroRoundData", rawHydroRoundData],
      ["hydroMetaData", rawHydroMetaData],
      ["externalData", rawExternalData],
    ].map(([key, value]) => [key, value])
  )
}

export const fetchBackendDataBeforeWallet = unstable_cache(
  uncachedFetchBackendDataBeforeWallet,
  ["fetchBackendDataBeforeWallet"],
  {
    revalidate: 60 * 5,
    tags: ["backendData"],
  }
)
