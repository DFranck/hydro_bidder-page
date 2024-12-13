import { Coin } from "@/app/ts_types/HydroBase.types"
import { AssetListEntry } from "@/contract-apis/fetchAssetListWithPrices"

export interface AugmentedCoin extends Coin {
  humanReadableDenom: string
  printableAmount: number
  valueInUsd: number
}

export function getCoinWithValueInUsd({
  coin,
  assetListWithPrices,
}: {
  coin: Coin
  assetListWithPrices: Record<string, AssetListEntry>
}): AugmentedCoin {
  if (!("get" in assetListWithPrices))
    return {
      ...coin,
      humanReadableDenom: coin.denom,
      printableAmount: Number(coin.amount) / 1e6,
      valueInUsd: 0,
    }

  const asset = assetListWithPrices[coin.denom]
  const assetPriceUsd = asset?.priceUsd ?? 0
  const decimals = asset?.decimals ?? 6
  const humanReadableDenom = asset?.symbol ?? coin.denom
  const printableAmount = Number(coin.amount) / 10 ** decimals

  return {
    ...coin,
    humanReadableDenom,
    printableAmount,
    valueInUsd: printableAmount * assetPriceUsd,
  } as AugmentedCoin
}
