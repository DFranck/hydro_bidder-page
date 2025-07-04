import { Coin } from "@/app/ts_types/MarketplaceBase.types"
import { getPriceMetaForDenom } from "./getPriceMetaForDenom"

export function getRewardsUsdTotal(
  rewards: Coin[],
  prices: Record<string, any>,
): number {
  return rewards.reduce((acc, r) => {
    const { price, exponent } = getPriceMetaForDenom(prices, r.denom)
    const realAmount = Number(r.amount) / Math.pow(10, exponent)
    return acc + realAmount * price
  }, 0)
}
