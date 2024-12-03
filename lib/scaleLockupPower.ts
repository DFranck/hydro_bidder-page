// Ported from cosmwasm contract

export function scaleLockupPower({
  lockupEpochLength,
  lockupTime,
  rawPower,
}: {
  lockupEpochLength: number
  lockupTime: number
  rawPower: bigint
}): bigint {
  const two = BigInt(2)

  // Scale lockup power
  // 1x if lockup is between 0 and 1 epochs
  // 1.25x if lockup is between 1 and 2 epochs
  // 1.5x if lockup is between 2 and 3 epochs
  // 2x if lockup is between 3 and 6 epochs
  // 4x if lockup is between 6 and 12 epochs
  if (lockupTime > lockupEpochLength * 6) {
    // 4x if lockup is over 6 epochs
    return rawPower * two * two
  } else if (lockupTime > lockupEpochLength * 3) {
    // 2x if lockup is between 3 and 6 epochs
    return rawPower * two
  } else if (lockupTime > lockupEpochLength * 2) {
    // 1.5x if lockup is between 2 and 3 epochs
    return rawPower + rawPower / two
  } else if (lockupTime > lockupEpochLength) {
    // 1.25x if lockup is between 1 and 2 epochs
    return rawPower + rawPower / (two * two)
  } else {
    // Covers 0 and 1 epoch which have no scaling
    return rawPower
  }
}
