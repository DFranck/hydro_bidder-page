import { AllowedLockupPeriodInEpochs } from "@/config"

// Scale lockup power
// 1x if lockup is between 0 and 1 epochs
// 1.5x if lockup is between 1 and 3 epochs
// 2x if lockup is between 3 and 6 epochs
// 4x if lockup is between 6 and 12 epochs

export function calculateLockupVotingPower(
  amount: number,
  lockupPeriod: AllowedLockupPeriodInEpochs
) {
  switch (lockupPeriod) {
    case AllowedLockupPeriodInEpochs.ONE_EPOCH:
      return amount
    case AllowedLockupPeriodInEpochs.TWO_EPOCHS:
      return amount * 1.25
    case AllowedLockupPeriodInEpochs.THREE_EPOCHS:
      return amount * 1.5
    default:
      return amount
  }
}
