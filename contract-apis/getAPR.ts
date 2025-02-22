export function getAPR({
  amountGained,
  principalAssets,
  rewardPeriodInMonths,
}: {
  amountGained: number
  principalAssets: number
  rewardPeriodInMonths: number
}) {
  return (amountGained / principalAssets) * (rewardPeriodInMonths / 12) || 0
}
