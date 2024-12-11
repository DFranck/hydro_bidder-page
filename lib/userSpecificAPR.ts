import { estimatedRewardForPower } from "./estimatedRewardForPower"

export function userSpecificAPR(
  proposalTotalTribute: number,
  myVotingPower: number,
  proposalPower: number,
  myLockedAtom: number
) {
  return (
    (estimatedRewardForPower({
      amount: proposalTotalTribute,
      walletVotingPower: myVotingPower,
      bidPower: proposalPower,
    }) /
      myLockedAtom) *
    12
  )
}
