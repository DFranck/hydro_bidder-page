export function calculateLsmCapacity(
  validator_bond_shares: string,
  liquid_shares: string
) {
  return Number(validator_bond_shares) * 250 - Number(liquid_shares)
}
