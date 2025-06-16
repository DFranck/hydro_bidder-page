"use server"

import { HydroBaseQueryClient } from "@/app/ts_types/HydroBase.client"
import { getCosmWasmClient } from "@/contract-apis/getCosmWasmClient"
import { invariant } from "ts-invariant"

export async function fetchTotalLockedTokens(): Promise<{
  totalLockedTokens: number
  lockedTokenMaxGlobal: number
}> {
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

  const [{ total_locked_tokens }, { constants }] = await Promise.all([
    hydroQueryClient.totalLockedTokens(),
    hydroQueryClient.constants(),
  ])

  return {
    totalLockedTokens: total_locked_tokens,
    lockedTokenMaxGlobal: constants.max_locked_tokens,
  }
}
