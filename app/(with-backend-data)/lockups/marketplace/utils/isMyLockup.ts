import { MarketplaceLockup } from "../types"

export function isMyLockup(
  lockup: MarketplaceLockup,
  myLockups: MarketplaceLockup[],
): boolean {
  return myLockups.some((l) => l.id === lockup.id)
}
