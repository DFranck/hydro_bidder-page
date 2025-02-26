import { MetricsFromNumia } from "@/contract-apis/types"
import { fetchWithRetry } from "./utils/fetchWithRetry"

export async function fetchNumiaMetricsData(): Promise<MetricsFromNumia> {
  if (!process.env.NUMIA_METRICS_ENDPOINT) {
    throw new Error("NUMIA_METRICS_ENDPOINT is not set")
  }

  const response = await fetchWithRetry(
    `${process.env.NUMIA_METRICS_ENDPOINT}?${new Date().getTime()}`,
    {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${process.env.NUMIA_COSMOS_HYDRO_APP_API_KEY}`,
      },
    }
  ).catch((error) => {
    throw new Error(`Failed to fetch Numia metrics data: ${error.message}`)
  })

  const metrics = (await response.json()) as MetricsFromNumia[]
  return metrics[0]
}
