"use server"

import { HydroBaseQueryClient } from "@/app/ts_types/HydroBase.client"
import { getCosmWasmClient } from "@/contract-apis/getCosmWasmClient"

export async function fetchHydroData() {
  if (!process.env.NEXT_PUBLIC_HYDRO_CONTRACT_ADDRESS) {
    throw new Error("Hydro contract address not set")
  }

  const client = await getCosmWasmClient()
  const hydroQueryClient = new HydroBaseQueryClient(
    client,
    process.env.NEXT_PUBLIC_HYDRO_CONTRACT_ADDRESS
  )

  const [{ constants }, currentRound, { tranches }] = await Promise.all([
    hydroQueryClient.constants(),
    hydroQueryClient.currentRound(),
    hydroQueryClient.tranches(),
  ])

  const { round_end } = await hydroQueryClient.roundEnd({
    roundId: currentRound.round_id,
  })

  return {
    constants,
    currentRound,
    tranches,
    roundEnd: round_end,
  }
}
