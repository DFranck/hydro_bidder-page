import { Coin } from "@/app/ts_types/HydroBase.types"
import { AssetListEntry } from "@/contract-apis/fetchAssetListWithPrices"

export interface AugmentedCoin extends Coin {
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

  return {
    ...coin,
    valueInUsd: (Number(coin.amount) / 10 ** decimals) * assetPriceUsd,
  } as AugmentedCoin
}
