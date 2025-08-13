import { TokenPrice } from "../marketplace/types"

export function getPriceMetaForDenom(
  prices: Record<string, TokenPrice>,
  denom: string,
) {
  const entry = prices[denom]
  if (entry) return { price: entry.token_price, exponent: entry.token_exponent }

  const fallback = Object.values(prices).find((p) => p.token_symbol === denom)
  return fallback
    ? { price: fallback.token_price, exponent: fallback.token_exponent }
    : { price: 0, exponent: 0 }
}
