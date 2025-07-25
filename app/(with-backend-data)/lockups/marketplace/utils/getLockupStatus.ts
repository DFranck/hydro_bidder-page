import { MarketplaceLockup } from "../types"

export const getLockupStatus = (lockup: MarketplaceLockup) => {
  if (lockup.listing.collection === "not-for-sale") {
    return "not-for-sale"
  } else return "for-sale"
}
