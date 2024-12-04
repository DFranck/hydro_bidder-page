import { getLockupPeriodMultiplier } from "@/lib/getLockupPeriodMultiplier"

export function scaleLockupPower({
  lockupEpochLength,
  lockupTime,
  rawPower,
}: {
  lockupEpochLength: number
  lockupTime: number
  rawPower: bigint
}): bigint {
  const multiplier = getLockupPeriodMultiplier({
    lockupEpochLength,
    lockupTime,
  })

  // Convert multiplier to basis points (100 = 1x) to handle decimals with BigInt
  const multiplierBasisPoints = Math.round(multiplier * 100)
  return (rawPower * BigInt(multiplierBasisPoints)) / BigInt(100)
}
