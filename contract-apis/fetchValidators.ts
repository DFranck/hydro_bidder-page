"use server"

import { ExtendedHttpEndpoint } from "@cosmos-kit/core"
import { Validator } from "./fetchWalletValidators"
import { fetchWithRetry } from "./fetchWithRetry"

export async function fetchValidators(
  restEndpoint: string | ExtendedHttpEndpoint
): Promise<Validator[]> {
  let url: string
  let headers: HeadersInit = {}

  if (typeof restEndpoint === "string") {
    url = restEndpoint
  } else {
    url = restEndpoint.url
    headers = restEndpoint.headers ?? headers
  }

  const response = await fetchWithRetry(
    `${url}cosmos/staking/v1beta1/validators?pagination.limit=500`,
    {
      headers: {
        ...headers,
        Accept: "application/json",
      },
      next: {
        revalidate: 60 * 5, // 5 minutes
      },
    }
  )
    .then((res) => res.json())
    .then((data) => data.validators)

  return response
}
