import { MarketplaceLockup, MarketplaceSortBy } from "../types"

export function sortLockups(
  lockups: MarketplaceLockup[],
  sortBy: MarketplaceSortBy,
): MarketplaceLockup[] {
  return [...lockups].sort((a, b) => {
    const hasPriceA = !!a.listing?.price?.amount
    const hasPriceB = !!b.listing?.price?.amount

    // PRICE ASCENDING
    if (sortBy === "price-asc") {
      if (hasPriceA && !hasPriceB) return -1
      if (!hasPriceA && hasPriceB) return 1
      if (!hasPriceA && !hasPriceB) return 0

      return Number(a.listing.price.amount) - Number(b.listing.price.amount)
    }

    // PRICE DESCENDING
    if (sortBy === "price-desc") {
      if (hasPriceA && !hasPriceB) return -1
      if (!hasPriceA && hasPriceB) return 1
      if (!hasPriceA && !hasPriceB) return 0

      return Number(b.listing.price.amount) - Number(a.listing.price.amount)
    }

    return 0
  })
}
