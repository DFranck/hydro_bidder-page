import { Validator } from "./fetchWalletValidators"

export async function fetchValidators(
  restEndpoint: string
): Promise<Validator[]> {
  const response = await fetch(
    `${restEndpoint}cosmos/staking/v1beta1/validators?pagination.limit=500`
  )
    .then((res) => res.json())
    .then((data) => data.validators)

  return response
}
