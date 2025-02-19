"use server"

import { unstable_cache } from "next/cache"
import { fetchExternalData } from "./api/fetchExternalData"
import { fetchHydroData } from "./api/fetchHydroData"
import { processBackendDataBeforeWallet } from "./processors/processBackendDataBeforeWallet"

async function uncachedFetchBackendDataBeforeWallet() {
  const [hydroData, externalData] = await Promise.all([
    fetchHydroData(),
    fetchExternalData(),
  ])

  return processBackendDataBeforeWallet({
    hydroData,
    externalData,
  })
}

export const fetchBackendDataBeforeWallet = unstable_cache(
  uncachedFetchBackendDataBeforeWallet,
  ["fetchBackendDataBeforeWallet"],
  {
    revalidate: 60 * 5,
    tags: ["backendData"],
  }
)
