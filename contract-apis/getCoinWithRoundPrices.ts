import { Coin } from "@/app/ts_types/HydroBase.types"
import { AugmentedCoin, RoundPrices } from "@/contract-apis/types"

export function getCoinWithRoundPrices({
  coin,
  roundPrices,
  validator,
}: {
  coin: Coin
  roundPrices: RoundPrices
  validator?: string
}): AugmentedCoin {
  const asset = roundPrices?.[coin.denom]
  const assetPriceUsd = asset?.token_price ?? 0
  const decimals = asset?.token_exponent ?? 6
  const humanReadableDenom = asset?.token_symbol ?? coin.denom
  const printableAmount = Number(coin.amount) / 10 ** decimals

  return {
    ...coin,
    humanReadableDenom: validator ? "ATOM" : humanReadableDenom,
    printableAmount,
    priceUsd: assetPriceUsd,
    valueUsd: printableAmount * assetPriceUsd,
  } as AugmentedCoin
}
