import { getLockupPeriodMultiplier } from "@/lib/getLockupPeriodMultiplier"

export function scaleLockupPower({
  lockedTokenEpochInNanos,
  lockupTime,
  rawPower,
}: {
  lockedTokenEpochInNanos: number
  lockupTime: number
  rawPower: bigint
}): bigint {
  const multiplier = getLockupPeriodMultiplier({
    lockedTokenEpochInNanos,
    lockupTime,
  })

  // Convert multiplier to basis points (100 = 1x) to handle decimals with BigInt
  const multiplierBasisPoints = Math.round(multiplier * 100)
  return (rawPower * BigInt(multiplierBasisPoints)) / BigInt(100)
}
