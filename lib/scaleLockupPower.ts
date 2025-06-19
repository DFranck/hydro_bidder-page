import { getLockupPeriodMultiplier } from "@/lib/getLockupPeriodMultiplier"

export function scaleLockupPower({
  lockedAtomEpochInNanos,
  lockupTime,
  rawPower,
}: {
  lockedAtomEpochInNanos: number
  lockupTime: number
  rawPower: bigint
}): bigint {
  const multiplier = getLockupPeriodMultiplier({
    lockedAtomEpochInNanos,
    lockupTime,
  })

  // Convert multiplier to basis points (100 = 1x) to handle decimals with BigInt
  const multiplierBasisPoints = Math.round(multiplier * 100)
  return (rawPower * BigInt(multiplierBasisPoints)) / BigInt(100)
}
