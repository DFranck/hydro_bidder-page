import { HydroBaseQueryClient } from "@/app/ts_types/HydroBase.client"
import { LiquidityDeployment } from "@/app/ts_types/HydroBase.types"
import {
  CamelCaseKeys,
  keysFromSnakeToCamelCase,
} from "@/lib/keysFromSnakeToCamelCase"
import { AssetListEntry } from "./fetchAssetListWithPrices"
import { AugmentedCoin, getCoinWithValueInUsd } from "./getCoinWithValueInUsd"
import { getCosmWasmClient } from "./getCosmWasmClient"

export interface AugmentedLiquidityDeployment
  extends Omit<SanitizedLiquidityDeployment, "fundsBeforeDeployment"> {
  fundsBeforeDeployment: AugmentedCoin[]
}

export interface SanitizedLiquidityDeployment
  extends Omit<CamelCaseKeys<LiquidityDeployment>, "proposalId"> {
  bidId: number
}

export async function fetchLiquidityDeployments({
  roundId,
  trancheId,
}: {
  roundId: number
  trancheId: number
}) {
  if (!process.env.NEXT_PUBLIC_HYDRO_CONTRACT_ADDRESS) {
    throw new Error("Hydro contract address not set")
  }

  const client = await getCosmWasmClient()
  const hydroQueryClient = new HydroBaseQueryClient(
    client,
    process.env.NEXT_PUBLIC_HYDRO_CONTRACT_ADDRESS
  )
  try {
    const { liquidity_deployments } =
      await hydroQueryClient.roundTrancheLiquidityDeployments({
        roundId,
        trancheId,
        startFrom: 0,
        limit: 1000,
      })
    return liquidity_deployments.map(sanitizeLiquidityDeployment)
  } catch (error) {
    return null
  }
}

function sanitizeLiquidityDeployment({
  proposal_id,
  ...liquidityDeployment
}: LiquidityDeployment): SanitizedLiquidityDeployment {
  return {
    ...keysFromSnakeToCamelCase(liquidityDeployment),
    bidId: proposal_id,
  }
}

export function augmentLiquidityDeployment({
  assetListWithPrices,
  liquidityDeployment,
}: {
  assetListWithPrices: Map<string, AssetListEntry>
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
