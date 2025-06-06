import { invariant } from "ts-invariant"
import { TributeBaseQueryClient } from "../../../app/ts_types/TributeBase.client"
import { Tribute } from "../../../app/ts_types/TributeBase.types"
import { getCosmWasmClient } from "../../../contract-apis/getCosmWasmClient"

export async function fetchRoundTributes({
  roundId,
  currentRoundId,
}: {
  roundId: number
  currentRoundId: number
}): Promise<Tribute[]> {
  const numiaTributesEndpoint = process.env.NUMIA_TRIBUTES_ENDPOINT

  const numiaCosmosHydroAppApiKey = process.env.NUMIA_COSMOS_HYDRO_APP_API_KEY

  const tributeContractAddress =
    process.env.NEXT_PUBLIC_TRIBUTE_CONTRACT_ADDRESS

  invariant(numiaTributesEndpoint, "NUMIA_TRIBUTES_ENDPOINT is not set")

  invariant(
    numiaCosmosHydroAppApiKey,
    "NUMIA_COSMOS_HYDRO_APP_API_KEY is not set"
  )

  invariant(
    tributeContractAddress,
    "NEXT_PUBLIC_TRIBUTE_CONTRACT_ADDRESS is not set"
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
      `${numiaTributesEndpoint}?round_id=${roundId}&time=${new Date().getTime()}`,
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
    
    // Add debugging and proper error handling
    console.log("fetchRoundTributes responseJson:", JSON.stringify(responseJson, null, 2))
    
    if (!Array.isArray(responseJson) || responseJson.length === 0) {
      console.warn(`No tribute data found for round ${roundId}`)
      return []
    }
    
    if (!responseJson[0] || !responseJson[0].response) {
      console.warn(`Invalid tribute response format for round ${roundId}:`, responseJson[0])
      return []
    }
    
    try {
      const tributes = JSON.parse(responseJson[0].response).data.tributes
      return tributes as Tribute[]
    } catch (error) {
      console.error(`Failed to parse tribute response for round ${roundId}:`, error)
      return []
    }
  }
}
