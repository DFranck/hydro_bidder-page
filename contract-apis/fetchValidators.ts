import { Validator } from "./fetchWalletValidators"
import { fetchWithRetry } from "./fetchWithRetry"

export async function fetchValidators(restEndpoint: {
  url: string
  headers?: HeadersInit
}): Promise<Validator[]> {
  const { url, headers } = restEndpoint

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
