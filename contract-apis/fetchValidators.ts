"use server"

import { Validator } from "./fetchWalletValidators"
import { fetchWithRetry } from "./fetchWithRetry"

export async function fetchValidators(endpoint: string): Promise<Validator[]> {
  const url = new URL(
    "/cosmos/staking/v1beta1/validators?pagination.limit=500",
    endpoint
  ).toString()
  const response = await fetchWithRetry(url)
    .then((res) => res.json())
    .then((data) => data.validators)

  return response
}
