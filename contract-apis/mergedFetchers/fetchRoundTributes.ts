"use server"

import { TributeBaseQueryClient } from "@/app/ts_types/TributeBase.client"
import { Tribute } from "@/app/ts_types/TributeBase.types"
import { getCosmWasmClient } from "@/contract-apis/getCosmWasmClient"
import "server-only"

export async function fetchRoundTributes(
  roundId: number,
  currentRoundId: number
): Promise<Tribute[]> {
  if (currentRoundId === roundId) {
    if (!process.env.NEXT_PUBLIC_TRIBUTE_CONTRACT_ADDRESS) {
      throw new Error("Tribute contract address not set")
    }

    const client = await getCosmWasmClient()
    const tributeQueryClient = new TributeBaseQueryClient(
      client,
      process.env.NEXT_PUBLIC_TRIBUTE_CONTRACT_ADDRESS || ""
    )

    const query = {
      roundId,
      limit: 1000,
      startFrom: 0,
    }

    const { tributes } = await tributeQueryClient.roundTributes(query)

    return tributes
  } else {
    if (!process.env.NUMIA_TRIBUTES_ENDPOINT) {
      throw new Error("NUMIA_TRIBUTES_ENDPOINT is not set")
    }

    const response = await fetch(
      `${process.env.NUMIA_TRIBUTES_ENDPOINT}?round_id=${roundId}`,
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${process.env.NUMIA_COSMOS_HYDRO_APP_API_KEY}`,
        },
      }
    )

    if (!response.ok) {
      throw new Error(
        `Failed to fetch numia tribute data: ${response.statusText}`
      )
    }

    // Clean up the response
    const responseJson = await response.json()
    const tributes = JSON.parse(responseJson[0].response).data.tributes
    return tributes as Tribute[]
  }
}
