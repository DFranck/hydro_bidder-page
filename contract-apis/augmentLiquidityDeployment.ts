import { AssetListEntry } from "@/contract-apis/fetchAssetListWithPrices"
import {
  AugmentedLiquidityDeployment,
  SanitizedLiquidityDeployment,
} from "@/contract-apis/fetchLiquidityDeployments"
import { getCoinWithValueInUsd } from "@/contract-apis/getCoinWithValueInUsd"

export function augmentLiquidityDeployment({
  assetListWithPrices,
  liquidityDeployment,
}: {
  assetListWithPrices: Record<string, AssetListEntry>
  liquidityDeployment: SanitizedLiquidityDeployment
}): AugmentedLiquidityDeployment {
  const augmentedDeployedFunds = liquidityDeployment.deployedFunds.map((coin) =>
    getCoinWithValueInUsd({
      coin,
      assetListWithPrices,
    })
  )

  const augmentedFundsBeforeDeployment =
    liquidityDeployment.fundsBeforeDeployment.map((coin) =>
      getCoinWithValueInUsd({
        coin,
        assetListWithPrices,
      })
    )

  return {
    ...liquidityDeployment,
    deployedFunds: augmentedDeployedFunds,
    fundsBeforeDeployment: augmentedFundsBeforeDeployment,
  }
}
