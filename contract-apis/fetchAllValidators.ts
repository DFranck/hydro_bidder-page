"use server"

import { Validator } from "./fetchMyValidators"

export async function fetchAllValidators(
  restEndpoint: string
): Promise<Validator[]> {
  const response = await fetch(
    `${restEndpoint}cosmos/staking/v1beta1/validators?pagination.limit=500`
  )
    .then((res) => res.json())
    .then((data) => data.validators)

  return response
}
