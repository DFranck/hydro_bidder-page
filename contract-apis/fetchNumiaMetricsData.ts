import {
  CamelCaseKeys,
  keysFromSnakeToCamelCase,
} from "@/lib/keysFromSnakeToCamelCase"

export interface MetricsFromNumia {
  current_round_pol_available: number
  current_round_pol_deployed: number
  current_round_unique_wallets: number
  current_round_total_atom_locked: number
  current_round_users_avg_token_locked: number
  current_round_users_apr: Array<{ period: string; apr: string }>
  all_time_unique_wallets: number
  all_time_total_atom_locked: number
  all_time_total_active_rounds: number
  all_time_apr: Array<{ period: string; apr: string }>
  all_time_users_avg_token_locked: number
  all_time_users_avg_active_rounds: number
  all_time_users_rewards: number
  all_time_users_apr: Array<{ period: string; apr: string }>
}

export interface SanitizedMetricsFromNumia
  extends CamelCaseKeys<MetricsFromNumia> {}

export async function fetchNumiaMetricsData(): Promise<SanitizedMetricsFromNumia> {
  const response = await fetch(
    "https://www.datalenses.zone/numia/cosmos/lensesV2/hydro/metrics"
  )

  const metrics = (await response.json()) as MetricsFromNumia[]

  return metrics.map(keysFromSnakeToCamelCase)[0]
}
