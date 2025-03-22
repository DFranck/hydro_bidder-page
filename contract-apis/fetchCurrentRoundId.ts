"use server"

import { HydroBaseQueryClient } from "@/app/ts_types/HydroBase.client"
import { getCosmWasmClient } from "@/contract-apis/getCosmWasmClient"
import { invariant } from "ts-invariant"

export async function fetchCurrentRoundId(): Promise<number> {
  const hydroContractAddress = process.env.NEXT_PUBLIC_HYDRO_CONTRACT_ADDRESS

  invariant(
    hydroContractAddress,
    "NEXT_PUBLIC_HYDRO_CONTRACT_ADDRESS is not set"
  )

  const client = await getCosmWasmClient()

  const hydroQueryClient = new HydroBaseQueryClient(
    client,
    hydroContractAddress
  )

  const { round_id } = await hydroQueryClient.currentRound()

  return round_id
}
