import { MarketplaceLockup } from "../types"

export function isListedMarketplaceLockup(
  lockup: any,
): lockup is MarketplaceLockup {
  return !!lockup.listing && lockup.listing.collection !== "not-for-sale"
}
