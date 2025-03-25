export function getAPR({
  amountGained,
  principalAssets,
  rewardPeriodInMonths,
}: {
  amountGained: number
  principalAssets: number
  rewardPeriodInMonths: number
}) {
  return !principalAssets
    ? Infinity
    : (amountGained / principalAssets) * (12 / rewardPeriodInMonths) || 0
}
