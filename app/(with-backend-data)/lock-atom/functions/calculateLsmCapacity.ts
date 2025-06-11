export function calculateLsmCapacity(
  delegator_shares: string,
  validator_liquid_staking_cap: string
) {
  return Number(delegator_shares) * Number(validator_liquid_staking_cap)
}
