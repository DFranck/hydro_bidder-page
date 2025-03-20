"use server"

import { BackendDataBeforeWallet } from "@/contract-apis/types"
import { getStore } from "@netlify/blobs"
import { unstable_cache } from "next/cache"
import { getEnvironmentVariable } from "./getEnvironmentVariable"

async function uncachedFetchBackendDataBeforeWallet(): Promise<BackendDataBeforeWallet> {
  const store = getStore({
    name: "raw-data",
    consistency: "eventual",
    siteID: getEnvironmentVariable("NETLIFY_SITE_ID"),
    token: getEnvironmentVariable("NETLIFY_API_TOKEN"),
  })

  const [rawHydroRoundData, rawHydroMetaData, rawExternalData] =
    await Promise.all([
      store.get("raw-hydro-round-data", { type: "json" }),
      store.get("raw-hydro-meta-data", { type: "json" }),
      store.get("raw-external-data", { type: "json" }),
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
