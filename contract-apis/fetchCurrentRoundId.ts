"use server"

import { HydroBaseQueryClient } from "@/app/ts_types/HydroBase.client"
import { getCosmWasmClient } from "@/contract-apis/getCosmWasmClient"
import { getEnvironmentVariable } from "@/contract-apis/getEnvironmentVariable"

export async function fetchCurrentRoundId(): Promise<number> {
  const client = await getCosmWasmClient()
  const hydroQueryClient = new HydroBaseQueryClient(
    client,
    getEnvironmentVariable("NEXT_PUBLIC_HYDRO_CONTRACT_ADDRESS")
  )

  const { round_id } = await hydroQueryClient.currentRound()

  return round_id
}
