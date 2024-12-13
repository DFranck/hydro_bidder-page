export function estimatedRewardForPower({
  amount,
  walletVotingPower,
  bidPower,
}: {
  amount: number
  walletVotingPower: number
  bidPower: number
}) {
  if (bidPower === 0) {
    return amount
  }

  return amount * (walletVotingPower / (bidPower + walletVotingPower))
}
