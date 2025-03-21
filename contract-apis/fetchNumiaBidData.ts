import { RawNumiaBid } from "@/contract-apis/types"
import { invariant } from "ts-invariant"
import { fetchWithRetry } from "./fetchWithRetry"

export const typeToTokenMap = {
  "ibc/837E876E": "SWTH",
}

export async function fetchNumiaBidData(): Promise<RawNumiaBid[]> {
  const numiaDeploymentsOverviewEndpoint =
    process.env.NUMIA_DEPLOYMENTS_OVERVIEW_ENDPOINT

  const numiaCosmosHydroAppApiKey = process.env.NUMIA_COSMOS_HYDRO_APP_API_KEY

  invariant(
    numiaDeploymentsOverviewEndpoint,
    "NUMIA_DEPLOYMENTS_OVERVIEW_ENDPOINT is not set"
  )

  invariant(
    numiaCosmosHydroAppApiKey,
    "NUMIA_COSMOS_HYDRO_APP_API_KEY is not set"
  )

  const response = await fetchWithRetry(`${numiaDeploymentsOverviewEndpoint}`, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${numiaCosmosHydroAppApiKey}`,
    },
    next: {
      revalidate: 60 * 5, // 5 minutes
    },
  }).catch((error) => {
    throw new Error(`Failed to fetch Numia bid data: ${error.message}`)
  })

  const numiaBids = (await response.json()) as RawNumiaBid[]

  return numiaBids
}
