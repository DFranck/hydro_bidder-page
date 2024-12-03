// APR Calc: your_est_reward / price(your_atom) * 12
// Non-user specific APR: 1_uatom_est_reward_at_specific_lock_time / price(1_uatom) * 12 (put a range?)
// 1 top line APR calc: sum(Max(non_user_apr)) + staking APR

export function estimatedRewardForPower(
  proposalTotalTribute: number,
  myVotingPower: number,
  proposalPower: number
) {
  if (proposalPower === 0) {
    return proposalTotalTribute
  }

  return (
    proposalTotalTribute * (myVotingPower / (proposalPower + myVotingPower))
  )
}
