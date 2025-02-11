import {
  CamelCaseKeys,
  keysFromSnakeToCamelCase,
} from "@/lib/keysFromSnakeToCamelCase"

interface MetricsFromNumia {
  // used
  all_time_pol_apr: number
  all_time_pol_deployed: number
  all_time_pol_revenue: number
  all_time_tribute_apr: number
  all_time_unique_wallets: number
  all_time_users_avg_rounds_locked: number
  all_time_users_avg_tokens_locked: number
  current_pol_available: number
  current_tribute_apr: number

  // not used
  all_time_pol_yield: number
  all_time_total_active_rounds: number
  all_time_total_atom_locked: number
  all_time_tribute_yield: number
  current_pol_deployed: number
  current_pol_deployment_cap: number
  current_pol_total: number
  current_total_atom_locked: number
  current_tribute_yield: number
  current_unique_wallets: number
  current_users_avg_rounds_locked: number
  current_users_avg_tokens_locked: number
}

export interface SanitizedMetricsFromNumia
  extends CamelCaseKeys<MetricsFromNumia> {}

export async function fetchNumiaMetricsData(): Promise<SanitizedMetricsFromNumia> {
  if (!process.env.NUMIA_METRICS_ENDPOINT) {
    throw new Error("NUMIA_METRICS_ENDPOINT is not set")
  }

  const response = await fetch(
    `${process.env.NUMIA_METRICS_ENDPOINT}?${new Date().getTime()}`,
    {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${process.env.NUMIA_COSMOS_HYDRO_APP_API_KEY}`,
      },
    }
  )

  const metrics = (await response.json()) as MetricsFromNumia[]

  return metrics.map(keysFromSnakeToCamelCase)[0]
}
