"use server"

import { BackendDataBeforeWallet } from "@/contract-apis/types"
import { unstable_cache } from "next/cache"
import rawExternalDataJson from "../public/data/raw-external-data.json"
import rawHydroMetaDataJson from "../public/data/raw-hydro-meta-data.json"
import rawHydroRoundDataJson from "../public/data/raw-hydro-round-data.json"

const requiredEnvVariables = [
  "NEXT_PUBLIC_HYDRO_CONTRACT_ADDRESS",
  "NEXT_PUBLIC_TRIBUTE_CONTRACT_ADDRESS",
  "NUMIA_BIDS_ENDPOINT",
  "NUMIA_COSMOS_HYDRO_APP_API_KEY",
  "NUMIA_DEPLOYMENTS_OVERVIEW_ENDPOINT",
  "NUMIA_LOCKUPS_ENDPOINT",
  "NUMIA_METRICS_ENDPOINT",
  "NUMIA_TRIBUTES_ENDPOINT",
  "NUMIA_USERS_ENDPOINT",
]

async function uncachedFetchBackendDataBeforeWallet(): Promise<BackendDataBeforeWallet> {
  requiredEnvVariables.forEach((envVariableName) => {
    if (!(envVariableName in process.env)) {
      throw new Error(
        `Missing env variable: ${envVariableName}. ${JSON.stringify(process.env, null, 2)}`
      )
    }
  })

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
