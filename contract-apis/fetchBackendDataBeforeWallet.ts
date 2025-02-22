"use server"

import { unstable_cache } from "next/cache"
import { fetchExternalData } from "./fetchExternalData"
import { fetchHydroData } from "./fetchHydroData"

async function uncachedFetchBackendDataBeforeWallet() {
  const [hydroData, externalData] = await Promise.all([
    fetchHydroData(),
    fetchExternalData(),
  ])

  return {
    hydroData,
    externalData,
  }
}

export const fetchBackendDataBeforeWallet = unstable_cache(
  uncachedFetchBackendDataBeforeWallet,
  ["fetchBackendDataBeforeWallet"],
  {
    revalidate: 60 * 5,
    tags: ["backendData"],
  }
)
