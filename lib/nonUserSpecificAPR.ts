import { AllowedLockupPeriodInEpochs } from "@/config"
import { estimatedRewardForPower } from "./estimatedRewardForPower"
import { scaleLockupPower } from "./scaleLockupPower"

export function nonUserSpecificAPR({
  atomPrice,
  lockupEpochLength,
  lockupPeriod,
  proposalPower,
  proposalTotalTribute,
}: {
  atomPrice: number
  lockupEpochLength: number
  lockupPeriod: AllowedLockupPeriodInEpochs
  proposalPower: number
  proposalTotalTribute: number
}) {
  // Get the power of 1 uatom locked for the specified time
  const oneUatomPower = scaleLockupPower({
    lockupEpochLength,
    lockupTime: lockupEpochLength * lockupPeriod,
    rawPower: BigInt(1),
  })

  const oneUatomReward = estimatedRewardForPower(
    proposalTotalTribute,
    Number(oneUatomPower),
    proposalPower
  )

  const oneUatomPrice = atomPrice / 1e6

  return (oneUatomReward / oneUatomPrice) * 12
}
