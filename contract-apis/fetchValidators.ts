import { Validator } from "./fetchWalletValidators"
import { fetchWithRetry } from "./utils/fetchWithRetry"

export async function fetchValidators(
  restEndpoint: string
): Promise<Validator[]> {
  const response = await fetchWithRetry(
    `${restEndpoint}cosmos/staking/v1beta1/validators?pagination.limit=500`,
    {
      headers: {
        Accept: "application/json",
      },
    }
  )
    .then((res) => res.json())
    .then((data) => data.validators)

  return response
}
