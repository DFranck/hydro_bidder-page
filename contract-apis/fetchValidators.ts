"use server"

import { ExtendedHttpEndpoint } from "@cosmos-kit/core"
import { Validator } from "./fetchWalletValidators"

export async function fetchValidators(
  restEndpoint: ExtendedHttpEndpoint
): Promise<Validator[]> {
  const { url, headers } = restEndpoint
  const response = await fetch(
    `${url.replace(/\/$/, "")}/cosmos/staking/v1beta1/validators?pagination.limit=500`,
    { headers }
  )
    .then((res) => res.json())
    .then((data) => data.validators)

  return response
}
