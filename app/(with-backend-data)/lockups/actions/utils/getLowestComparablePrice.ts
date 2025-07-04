import { AugmentedLockup } from "@/contract-apis/types"
import { MarketplaceLockup } from "../../marketplace/types"
import { isListedMarketplaceLockup } from "../../marketplace/utils/isListedMarketplaceLockup"

export function getLowestComparablePrice(
  lockups: MarketplaceLockup[],
  target: MarketplaceLockup | AugmentedLockup,
) {
  const norm = (x: any) => (typeof x === "string" ? x : String(x))
  const listedLockups = lockups.filter(isListedMarketplaceLockup)

  const fullComparables = listedLockups.filter(
    (l) =>
      l.id !== target.id &&
      norm(l.funds.denom) === norm(target.funds.denom) &&
      norm(l.funds.amount) === norm(target.funds.amount),
  )

  if (fullComparables.length === 0) return null

  const lowest = fullComparables.reduce((min, l) => {
    const current = Number(l.listing.price.amount)
    const minValue = Number(min.listing.price.amount)
    return current < minValue ? l : min
  }, fullComparables[0])

  return lowest.listing.price.amount
}
