import type { PriceDetails } from "@/contract-apis/types"

export type DenomOption = {
  name: string
  value: string
  price?: number
  exponent?: number
}

export function buildDenomOptions(
  currentRoundPrices: Record<string, PriceDetails> | undefined
): DenomOption[] {
  if (!currentRoundPrices) return []
  return Object.entries(currentRoundPrices).map(([value, asset]) => ({
    name: (asset?.token_symbol ?? value).replace(".", " "),
    value,
    price: asset?.token_price,
    exponent: asset?.token_exponent,
  }))
}
