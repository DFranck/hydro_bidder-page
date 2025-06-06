import { getHydroQueryClient } from "@/app/api/v2/_helpers/getHydroQueryClient"
import { Proposal } from "@/app/ts_types/HydroBase.types"

export async function fetchRoundBids({
  hydroContract,
  roundId,
  trancheId,
  currentRoundId,
}: {
  hydroContract: string
  roundId: number
  trancheId: number
  currentRoundId: number
}): Promise<Proposal[]> {
  if (currentRoundId === roundId) {
    const hydroQueryClient = await getHydroQueryClient({
      hydroContract: hydroContract,
    })

    const query = {
      roundId,
      trancheId,
      limit: 1000,
      startFrom: 0,
    }

    const { proposals } = await hydroQueryClient.roundProposals(query)

    return proposals
  } else {
    try {
      const url = new URL("/hydro/v2/round_bids", "https://cosmos.numia.xyz")
      url.searchParams.append("hydro_contract", hydroContract)
      url.searchParams.append("round_id", roundId.toString())
      url.searchParams.append("time", new Date().getTime().toString())

      console.log(url)

      const response = await fetch(url, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${process.env.NUMIA_COSMOS_HYDRO_APP_API_KEY}`,
        },
      })

      if (!response.ok) {
        throw new Error(
          `Failed to fetch numia bids data: ${response.statusText}`
        )
      }

      // Clean up the response
      let responseJson
      try {
        responseJson = await response.json()
      } catch (error) {
        throw new Error(`Error converting response to JSON: ${error}`)
      }

      const proposals = JSON.parse(responseJson[0].response).data.proposals

      return proposals as Proposal[]
    } catch (error) {
      throw new Error(`Error fetching bids: ${error}`)
    }
  }
}
