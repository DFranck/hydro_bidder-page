"use server"

import { HydroBaseQueryClient } from "@/app/ts_types/HydroBase.client"
import { endpointsShared } from "@/config"
import { getCosmWasmClient } from "@/contract-apis/getCosmWasmClient"

export async function fetchCurrentRoundId(): Promise<number> {
  if (!process.env.NEXT_PUBLIC_HYDRO_CONTRACT_ADDRESS) {
    throw new Error("Hydro contract address not set")
  }

  const neutronRpcEndpoint = endpointsShared.neutron.rpc[0]

  const client = await getCosmWasmClient({
    endpoint: neutronRpcEndpoint,
  })
  const hydroQueryClient = new HydroBaseQueryClient(
    client,
    process.env.NEXT_PUBLIC_HYDRO_CONTRACT_ADDRESS
  )

  const { round_id } = await hydroQueryClient.currentRound()

  return round_id
}
