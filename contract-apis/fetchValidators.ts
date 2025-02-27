import { Validator } from "./fetchWalletValidators"
import { fetchWithRetry } from "./fetchWithRetry"

export async function fetchValidators(
  restEndpoint: string
): Promise<Validator[]> {
  const response = await fetchWithRetry(
    `${restEndpoint}cosmos/staking/v1beta1/validators?pagination.limit=500`,
    {
      headers: {
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
