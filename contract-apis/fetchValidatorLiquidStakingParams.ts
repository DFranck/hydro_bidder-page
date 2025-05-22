"use server"

import { Validator } from "./fetchWalletValidators"
import { fetchWithRetry } from "./fetchWithRetry"

export type ValidatorLiquidStakingParams = {
  global_liquid_staking_cap: string
  validator_liquid_staking_cap: string
}

export async function fetchValidatorLiquidStakingParams(endpoint: string): Promise<ValidatorLiquidStakingParams> {
  const url = new URL(
    "/gaia/liquid/v1beta1/params",
    endpoint
  ).toString()
  const response = await fetchWithRetry(url)
    .then((res) => res.json())
    .then((data) => data.params)

  return response
}
