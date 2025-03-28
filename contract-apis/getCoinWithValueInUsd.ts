import { Coin } from "@/app/ts_types/HydroBase.types"
import {
  AssetListWithPrices,
  AugmentedCoin,
  RoundPrices,
} from "@/contract-apis/types"

export function getCoinWithValueInUsd({
  coin,
  assetListWithPrices,
}: {
  coin: Coin
  assetListWithPrices: AssetListWithPrices
}): AugmentedCoin {
  const asset = assetListWithPrices[coin.denom]
  const assetPriceUsd = asset?.priceUsd ?? 0
  const decimals = asset?.decimals ?? 6
  const humanReadableDenom = asset?.symbol ?? coin.denom
  const printableAmount = Number(coin.amount) / 10 ** decimals

  return {
    ...coin,
    humanReadableDenom,
    printableAmount,
    priceUsd: assetPriceUsd,
    valueUsd: printableAmount * assetPriceUsd,
  } as AugmentedCoin
}

export function getCoinWithValueInUsdByRoundPrices({
  coin,
  roundPrices,
}: {
  coin: Coin
  roundPrices: RoundPrices
}): AugmentedCoin {
  const asset = roundPrices[coin.denom]
  const assetPriceUsd = asset?.token_price ?? 0
  const decimals = asset?.token_exponent ?? 6
  const humanReadableDenom = asset?.token_symbol ?? coin.denom
  const printableAmount = Number(coin.amount) / 10 ** decimals

  return {
    ...coin,
    humanReadableDenom,
    printableAmount,
    priceUsd: assetPriceUsd,
    valueUsd: printableAmount * assetPriceUsd,
  } as AugmentedCoin
}
