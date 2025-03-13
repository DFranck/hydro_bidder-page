"use server"

import { HydroBaseQueryClient } from "@/app/ts_types/HydroBase.client"
import { LiquidityDeployment } from "@/app/ts_types/HydroBase.types"
import { getEndpoints } from "@/config"
import {
  CamelCaseKeys,
  keysFromSnakeToCamelCase,
} from "@/lib/keysFromSnakeToCamelCase"
import { AugmentedCoin } from "./getCoinWithValueInUsd"
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

  const neutronRpcEndpoint = getEndpoints({
    environmentVariables: {
      NUMIA_COSMOS_HYDRO_APP_API_KEY:
        process.env.NUMIA_COSMOS_HYDRO_APP_API_KEY!,
    },
  }).neutron.rpc[0]

  const client = await getCosmWasmClient({
    endpoint: neutronRpcEndpoint,
  })
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
