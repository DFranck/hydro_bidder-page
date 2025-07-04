import { Listing } from "@/app/ts_types/MarketplaceBase.types"
import { AugmentedLockup } from "@/contract-apis/types"
import { allowedListAmounts } from "../config/allowedListAmounts"
import { MarketplaceLockup } from "../types"

// for not-for-sale lockups
export const createFakeListing = (lockupId: number): Listing => ({
  collection: "not-for-sale",
  price: { denom: "", amount: "" },
  seller: "",
  token_id: String(lockupId),
  listing_id: lockupId,
})

// filter out lockups that are not match allowedListAmounts
export function getMarketplaceLockups(
  hydroLockups: AugmentedLockup[],
  listings: Listing[],
): MarketplaceLockup[] {
  return hydroLockups
    .filter((lockup) => allowedListAmounts.includes(lockup.funds.amount))
    .map((lockup) => {
      const listing =
        listings.find((l) => String(l.token_id) === String(lockup.id)) ??
        createFakeListing(lockup.id)
      return { ...lockup, listing }
    })
}
