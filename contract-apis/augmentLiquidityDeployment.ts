import { getCoinWithValueInUsd } from "@/contract-apis/getCoinWithValueInUsd"
import {
  AssetListWithPrices,
  AugmentedLiquidityDeployment,
  SanitizedLiquidityDeployment,
} from "@/contract-apis/types"

export function augmentLiquidityDeployment({
  assetListWithPrices,
  liquidityDeployment,
}: {
  assetListWithPrices: AssetListWithPrices
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
