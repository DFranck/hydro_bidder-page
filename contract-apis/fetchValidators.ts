"use server"

import { ExtendedHttpEndpoint } from "@cosmos-kit/core"
import { Validator } from "./fetchWalletValidators"

export async function fetchValidators(
  restEndpoint: ExtendedHttpEndpoint
): Promise<Validator[]> {
  const { url: endpointUrl, headers } = restEndpoint

  const urlToFetch = new URL(
    `/cosmos/staking/v1beta1/validators?pagination.limit=500`,
    endpointUrl
  )

  const response = await fetch(urlToFetch, { headers })
    .then((res) => res.json())
    .then((data) => data.validators)

  return response
}
