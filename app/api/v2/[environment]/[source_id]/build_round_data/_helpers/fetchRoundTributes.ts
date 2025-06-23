import { getTributeQueryClient } from "@/app/api/v2/_helpers/getTributeQueryClient"
import { Tribute } from "@/app/ts_types/TributeBase.types"

export async function fetchRoundTributes({
  roundId,
  currentRoundId,
  tributeContract,
}: {
  roundId: number
  currentRoundId: number
  tributeContract: string
}): Promise<Tribute[]> {
  if (currentRoundId === roundId) {
    const tributeQueryClient = await getTributeQueryClient({
      tributeContract,
    })

    const query = {
      roundId,
      limit: 1000,
      startFrom: 0,
    }

    const { tributes } = await tributeQueryClient.roundTributes(query)

    return tributes
  } else {
    const url = new URL("/hydro/v2/round_tributes", "https://cosmos.numia.xyz")
    url.searchParams.append("tribute_contract", tributeContract)
    url.searchParams.append("round_id", roundId.toString())

    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${process.env.NUMIA_COSMOS_HYDRO_APP_API_KEY}`,
      },
    })

    if (!response.ok) {
      throw new Error(
        `Failed to fetch numia tribute data: ${response.statusText}`
      )
    }

    const responseJson = await response.json()

    if (!Array.isArray(responseJson) || responseJson.length === 0) {
      console.warn(`No tribute data found for round ${roundId}`)
      return []
    }

    if (!responseJson[0] || !responseJson[0].response) {
      console.warn(
        `Invalid tribute response format for round ${roundId}:`,
        responseJson[0]
      )
      return []
    }

    try {
      const tributes = JSON.parse(responseJson[0].response).data.tributes
      return tributes as Tribute[]
    } catch (error) {
      console.error(
        `Failed to parse tribute response for round ${roundId}:`,
        error
      )
      return []
    }
  }
}
