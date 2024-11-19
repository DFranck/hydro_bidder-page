import { ChainContext } from "@cosmos-kit/core"

export type Validator = {
  operator_address: string
  description: {
    moniker: string
  }
  validator_bond_shares: string
  liquid_shares: string
  delegator_shares: string
}

export type Delegation = {
  delegation: {
    delegator_address: string
    validator_address: string
    shares: string
  }
  balance: {
    denom: string
    amount: string
  }
}

export type ValidatorDelegation = {
  validator: Validator
  delegation: Delegation
  delegation_balance: {
    denom: string
    amount: string
  }
}

export const fetchMyValidators = async (
  chain: ChainContext,
  delegatorAddress: string
): Promise<ValidatorDelegation[]> => {
  const restEndpoint = await chain.getRestEndpoint()

  const [validatorsResponse, delegationsResponse] = await Promise.all([
    fetch(
      `${restEndpoint}cosmos/staking/v1beta1/delegators/${delegatorAddress}/validators`
    ).then((res) => res.json()),
    fetch(
      `${restEndpoint}cosmos/staking/v1beta1/delegations/${delegatorAddress}`
    ).then((res) => res.json()),
  ])

  if (!validatorsResponse.validators) {
    throw new Error("Failed to fetch validators")
  }

  if (!delegationsResponse.delegation_responses) {
    throw new Error("Failed to fetch delegations")
  }

  const validators = validatorsResponse.validators
  const delegations = delegationsResponse.delegation_responses

  return validators
    .map((validator: Validator): ValidatorDelegation | null => {
      const delegation = delegations.find(
        (d: Delegation) =>
          d.delegation.validator_address === validator.operator_address
      )
      if (delegation) {
        return {
          validator,
          delegation: delegation.delegation,
          delegation_balance: delegation.balance,
        }
      }
      return null
    })
    .filter((item: ValidatorDelegation | null) => item !== null)
}
