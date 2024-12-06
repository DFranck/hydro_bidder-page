import { estimatedRewardForPower } from "./estimatedRewardForPower"

export function userSpecificAPR(
  proposalTotalTribute: number,
  myVotingPower: number,
  proposalPower: number,
  myLockedAtom: number
) {
  return (
    (estimatedRewardForPower({
      proposalTotalTribute,
      myVotingPower,
      proposalPower,
    }) /
      myLockedAtom) *
    12
  )
}
