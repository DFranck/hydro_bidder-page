import { MetricsFromNumia } from "@/contract-apis/types"
import { invariant } from "ts-invariant"
import { fetchWithRetry } from "./fetchWithRetry"

export async function fetchNumiaMetricsData(): Promise<MetricsFromNumia> {
  const numiaMetricsEndpoint = process.env.NUMIA_METRICS_ENDPOINT

  const numiaCosmosHydroAppApiKey = process.env.NUMIA_COSMOS_HYDRO_APP_API_KEY

  invariant(numiaMetricsEndpoint, "NUMIA_METRICS_ENDPOINT is not set")

  invariant(
    numiaCosmosHydroAppApiKey,
    "NUMIA_COSMOS_HYDRO_APP_API_KEY is not set"
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
  return metrics?.[0] ?? {}
}
