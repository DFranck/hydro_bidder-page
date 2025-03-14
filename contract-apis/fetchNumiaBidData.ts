import { RawNumiaBid } from "@/contract-apis/types"
import { fetchWithRetry } from "./fetchWithRetry"
import { getEnvironmentVariable } from "@/contract-apis/getEnvironmentVariable"

export const typeToTokenMap = {
  "ibc/837E876E": "SWTH",
}

export async function fetchNumiaBidData(): Promise<RawNumiaBid[]> {
  const numiaDeploymentsOverviewEndpoint = getEnvironmentVariable(
    "NUMIA_DEPLOYMENTS_OVERVIEW_ENDPOINT"
  )
  const numiaCosmosHydroAppApiKey = getEnvironmentVariable(
    "NUMIA_COSMOS_HYDRO_APP_API_KEY"
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
