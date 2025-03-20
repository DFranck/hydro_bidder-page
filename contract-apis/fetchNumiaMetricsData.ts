import { getEnvironmentVariable } from "@/contract-apis/getEnvironmentVariable"
import { MetricsFromNumia } from "@/contract-apis/types"
import { fetchWithRetry } from "./fetchWithRetry"

export async function fetchNumiaMetricsData(): Promise<MetricsFromNumia> {
  const numiaMetricsEndpoint = getEnvironmentVariable("NUMIA_METRICS_ENDPOINT")
  const numiaCosmosHydroAppApiKey = getEnvironmentVariable(
    "NUMIA_COSMOS_HYDRO_APP_API_KEY"
  )

  const response = await fetchWithRetry(numiaMetricsEndpoint, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${numiaCosmosHydroAppApiKey}`,
    },
    next: {
      revalidate: 60 * 5, // 5 minutes
    },
  }).catch((error) => {
    throw new Error(`Failed to fetch Numia metrics data: ${error.message}`)
  })

  const metrics = (await response.json()) as MetricsFromNumia[]
  return metrics[0]
}
