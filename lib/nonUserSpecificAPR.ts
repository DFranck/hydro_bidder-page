import { AllowedLockupPeriodInEpochs } from "@/config"
import { estimatedRewardForPower } from "./estimatedRewardForPower"
import { scaleLockupPower } from "./scaleLockupPower"

export function nonUserSpecificAPR({
  atomPrice,
  lockedAtomEpochInNanos,
  lockupPeriod,
  proposalPower,
  proposalTotalTribute,
}: {
  atomPrice: number
  lockedAtomEpochInNanos: number
  lockupPeriod: AllowedLockupPeriodInEpochs
  proposalPower: number
  proposalTotalTribute: number
}) {
  // Get the power of 1 uatom locked for the specified time
  const oneUatomPower = scaleLockupPower({
    lockedAtomEpochInNanos,
    lockupTime: lockedAtomEpochInNanos * lockupPeriod,
    rawPower: BigInt(1),
  })

  const oneUatomReward = estimatedRewardForPower({
    amount: proposalTotalTribute,
    walletVotingPower: Number(oneUatomPower),
    bidPower: proposalPower,
  })

  const oneUatomPrice = atomPrice / 1e6

  return (oneUatomReward / oneUatomPrice) * 12
}
