// Ported from cosmwasm contract

export function getLockupPeriodMultiplier({
  lockedAtomEpochInNanos,
  lockupTime,
}: {
  lockedAtomEpochInNanos: number
  lockupTime: number
}): number {
  // Scale lockup power
  // 1x if lockup is between 0 and 1 epochs
  // 1.25x if lockup is between 1 and 2 epochs
  // 1.5x if lockup is between 2 and 3 epochs
  // 2x if lockup is between 3 and 6 epochs
  // 4x if lockup is between 6 and 12 epochs
  if (lockupTime > lockedAtomEpochInNanos * 6) {
    // 4x if lockup is over 6 epochs
    return 4
  } else if (lockupTime > lockedAtomEpochInNanos * 3) {
    // 2x if lockup is between 3 and 6 epochs
    return 2
  } else if (lockupTime > lockedAtomEpochInNanos * 2) {
    // 1.5x if lockup is between 2 and 3 epochs
    return 1.5
  } else if (lockupTime > lockedAtomEpochInNanos) {
    // 1.25x if lockup is between 1 and 2 epochs
    return 1.25
  } else {
    // Covers 0 and 1 epoch which have no scaling
    return 1
  }
}
