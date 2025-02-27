"use server"

import { BackendDataBeforeWallet } from "@/contract-apis/types"
import { unstable_cache } from "next/cache"
import { fetchExternalData } from "./fetchExternalData"
import { fetchHydroData } from "./fetchHydroData"
import { fetchHydroRoundsData } from "./testingFiles/fetchHydroRoundsData"

async function uncachedFetchBackendDataBeforeWallet(): Promise<BackendDataBeforeWallet> {
  const [hydroRoundsData, hydroData, externalData] = await Promise.all([
    fetchHydroRoundsData(),
    fetchHydroData(),
    fetchExternalData(),
  ])

  return {
    hydroRoundsData,
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
