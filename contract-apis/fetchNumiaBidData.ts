import { RawNumiaBid } from "@/contract-apis/types"
import { fetchWithRetry } from "./fetchWithRetry"

export const typeToTokenMap = {
  "ibc/837E876E": "SWTH",
}

export async function fetchNumiaBidData({
  numiaCosmosHydroAppApiKey,
  numiaDeploymentsOverviewEndpoint,
}: {
  numiaCosmosHydroAppApiKey: string
  numiaDeploymentsOverviewEndpoint: string
}): Promise<RawNumiaBid[]> {
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
