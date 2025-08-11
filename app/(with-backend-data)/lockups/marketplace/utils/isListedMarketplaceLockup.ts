import { MarketplaceLockup } from "../types";

export function isListedMarketplaceLockup(lockup: any): lockup is MarketplaceLockup {
  const listed = !!lockup?.listing && lockup.listing.collection !== "not-for-sale";

  return listed;
}
