import { Coin } from "@/app/ts_types/HydroBase.types"
import { AssetListEntry } from "@/contract-apis/fetchAssetListWithPrices"

export interface AugmentedCoin extends Coin {
  humanReadableDenom: string
  valueInUsd: number
}

export function getCoinWithValueInUsd({
  coin,
  assetListWithPrices,
}: {
  coin: Coin
  assetListWithPrices: Map<string, AssetListEntry>
}) {
  const asset = assetListWithPrices.get(coin.denom)
  const assetPriceUsd = asset?.priceUsd ?? 0
  const decimals = asset?.decimals ?? 6
  const humanReadableDenom = asset?.symbol ?? coin.denom

  return {
    ...coin,
    humanReadableDenom,
    valueInUsd: (Number(coin.amount) / 10 ** decimals) * assetPriceUsd,
  } as AugmentedCoin
}
