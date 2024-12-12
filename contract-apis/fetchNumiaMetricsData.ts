import {
  CamelCaseKeys,
  keysFromSnakeToCamelCase,
} from "@/lib/keysFromSnakeToCamelCase"

interface MetricsFromNumia {
  all_time_apr: Array<{ period: string; apr: string }>
  all_time_total_active_rounds: number
  all_time_total_atom_locked: number
  all_time_unique_wallets: number
  all_time_users_apr: Array<{ period: string; apr: string }>
  all_time_users_avg_active_rounds: number
  all_time_users_avg_token_locked: number
  all_time_users_rewards: number
  current_round_pol_available: number
  current_round_pol_deployed: number
  current_round_total_atom_locked: number
  current_round_unique_wallets: number
  current_round_users_apr: Array<{ period: string; apr: string }>
  current_round_users_avg_token_locked: number
}

export interface SanitizedMetricsFromNumia
  extends CamelCaseKeys<MetricsFromNumia> {}

export async function fetchNumiaMetricsData(): Promise<SanitizedMetricsFromNumia> {
  if (!process.env.NUMIA_METRICS_ENDPOINT) {
    throw new Error("NUMIA_METRICS_ENDPOINT is not set")
  }

  const response = await fetch(process.env.NUMIA_METRICS_ENDPOINT, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${process.env.NUMIA_COSMOS_HYDRO_APP_API_KEY}`,
    },
  })

  const metrics = (await response.json()) as MetricsFromNumia[]

  return metrics.map(keysFromSnakeToCamelCase)[0]
}
