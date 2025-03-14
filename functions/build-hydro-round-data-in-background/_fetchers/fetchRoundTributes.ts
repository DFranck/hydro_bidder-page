import { TributeBaseQueryClient } from "@/app/ts_types/TributeBase.client"
import { Tribute } from "@/app/ts_types/TributeBase.types"
import { getCosmWasmClient } from "@/contract-apis/getCosmWasmClient"
import { getEnvironmentVariable } from "@/contract-apis/getEnvironmentVariable"
import "@netlify/functions"

export async function fetchRoundTributes({
  roundId,
  currentRoundId,
}: {
  roundId: number
  currentRoundId: number
}): Promise<Tribute[]> {
  const numiaTributesEndpoint = getEnvironmentVariable(
    "NEXT_PUBLIC_NUMIA_TRIBUTES_ENDPOINT"
  )
  const numiaCosmosHydroAppApiKey = getEnvironmentVariable(
    "NEXT_PUBLIC_NUMIA_COSMOS_HYDRO_APP_API_KEY"
  )
  const tributeContractAddress = getEnvironmentVariable(
    "NEXT_PUBLIC_TRIBUTE_CONTRACT_ADDRESS"
  )

  if (currentRoundId === roundId) {
    const client = await getCosmWasmClient()
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
