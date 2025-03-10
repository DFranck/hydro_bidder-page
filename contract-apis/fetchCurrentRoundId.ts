"use server"

import { HydroBaseQueryClient } from "@/app/ts_types/HydroBase.client"
import { getEndpoints } from "@/config"
import { getCosmWasmClient } from "@/contract-apis/getCosmWasmClient"

export async function fetchCurrentRoundId(): Promise<number> {
  const hydroContractAddress = process.env.NEXT_PUBLIC_HYDRO_CONTRACT_ADDRESS
  const numiaCosmosHydroAppApiKey = process.env.NUMIA_COSMOS_HYDRO_APP_API_KEY

  if (!hydroContractAddress) {
    throw new Error("Hydro contract address not set")
  }
  if (!numiaCosmosHydroAppApiKey) {
    throw new Error("Numia Cosmos Hydro App API key not set")
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
    hydroContractAddress
  )

  const { round_id } = await hydroQueryClient.currentRound()

  return round_id
}
