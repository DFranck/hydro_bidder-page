import { TributeBaseQueryClient } from "@/app/ts_types/TributeBase.client"
import { Tribute } from "@/app/ts_types/TributeBase.types"
import { getCosmWasmClient } from "@/contract-apis/getCosmWasmClient"
import "@netlify/functions"

export async function fetchRoundTributes({
  roundId,
  currentRoundId,
  numiaTributesEndpoint,
  numiaCosmosHydroAppApiKey,
  tributeContractAddress,
}: {
  roundId: number
  currentRoundId: number
  numiaTributesEndpoint: string
  numiaCosmosHydroAppApiKey: string
  tributeContractAddress: string
}): Promise<Tribute[]> {
  if (currentRoundId === roundId) {
    const client = await getCosmWasmClient({ numiaCosmosHydroAppApiKey })
    const tributeQueryClient = new TributeBaseQueryClient(
      client,
      tributeContractAddress
    )

    const query = {
      roundId,
      limit: 1000,
      startFrom: 0,
    }

    const { tributes } = await tributeQueryClient.roundTributes(query)

    return tributes
  } else {
    const response = await fetch(
      `${numiaTributesEndpoint}?round_id=${roundId}`,
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${numiaCosmosHydroAppApiKey}`,
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
