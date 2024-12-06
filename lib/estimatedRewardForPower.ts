export function estimatedRewardForPower({
  proposalTotalTribute,
  myVotingPower,
  proposalPower,
}: {
  proposalTotalTribute: number
  myVotingPower: number
  proposalPower: number
}) {
  if (proposalPower === 0) {
    return proposalTotalTribute
  }

  return (
    proposalTotalTribute * (myVotingPower / (proposalPower + myVotingPower))
  )
}
