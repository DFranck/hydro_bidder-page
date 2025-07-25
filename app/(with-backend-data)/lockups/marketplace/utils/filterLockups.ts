import { getDenomExponent } from "../../utils/getDenomExponent"
import { getDisplayDenom } from "../../utils/getDisplayDenom"
import { MarketplaceFilters, MarketplaceLockup } from "../types"
import { getLockupStatus } from "./getLockupStatus"
import { isMyLockup } from "./isMyLockup"

export function filterLockups(
  lockups: MarketplaceLockup[],
  filters: MarketplaceFilters,
  myLockups: MarketplaceLockup[],
): MarketplaceLockup[] {
  return lockups.filter((lockup) => {
    const status = getLockupStatus(lockup)
    const denom = getDisplayDenom(lockup.funds.denom)
    const exponent = getDenomExponent(lockup.funds.denom)
    const isMine = isMyLockup(lockup, myLockups)

    const minPriceBase =
      filters.useMinPrice && filters.minPrice !== undefined
        ? Number(filters.minPrice) * Math.pow(10, exponent)
        : undefined

    const maxPriceBase =
      filters.useMaxPrice && filters.maxPrice !== undefined
        ? Number(filters.maxPrice) * Math.pow(10, exponent)
        : undefined

    // Exclusive status filtering
    if (filters.status.length > 0) {
      const isForSale = status === "for-sale"
      const isNotForSale = status === "not-for-sale"

      const shouldInclude =
        (filters.status.includes("for-sale") && isForSale && !isMine) ||
        (filters.status.includes("not-for-sale") && isNotForSale && !isMine) ||
        (filters.status.includes("isMine") && isMine)

      if (!shouldInclude) {
        return false
      }
    }
    if (filters.denoms.length > 0 && !filters.denoms.includes(denom)) {
      return false
    }

    if (filters.useMinPrice || filters.useMaxPrice) {
      if (status !== "for-sale") return false

      const price = Number(lockup.listing?.price?.amount ?? 0)

      if (minPriceBase !== undefined && price < minPriceBase) {
        return false
      }
      if (maxPriceBase !== undefined && price > maxPriceBase) {
        return false
      }
    }

    return true
  })
}
