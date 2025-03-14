"use server"

import { BackendDataBeforeWallet } from "@/contract-apis/types"
import { unstable_cache } from "next/cache"
import rawExternalDataJson from "../public/data/raw-external-data.json"
import rawHydroMetaDataJson from "../public/data/raw-hydro-meta-data.json"
import rawHydroRoundDataJson from "../public/data/raw-hydro-round-data.json"

async function uncachedFetchBackendDataBeforeWallet(): Promise<BackendDataBeforeWallet> {
  return Object.fromEntries(
    [
      ["hydroRoundData", rawHydroRoundDataJson],
      ["hydroMetaData", rawHydroMetaDataJson],
      ["externalData", rawExternalDataJson],
    ].map(([key, value]) => [key, value[key as keyof typeof value]])
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
