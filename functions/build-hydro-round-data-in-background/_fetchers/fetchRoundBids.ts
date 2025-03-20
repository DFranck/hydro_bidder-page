import { HydroBaseQueryClient } from "@/app/ts_types/HydroBase.client"
import { Proposal } from "@/app/ts_types/HydroBase.types"
import { getCosmWasmClient } from "@/contract-apis/getCosmWasmClient"
import { getEnvironmentVariable } from "@/contract-apis/getEnvironmentVariable"

export async function fetchRoundBids({
  roundId,
  trancheId,
  currentRoundId,
}: {
  roundId: number
  trancheId: number
  currentRoundId: number
}): Promise<Proposal[]> {
  const numiaBidsEndpoint = getEnvironmentVariable("NUMIA_BIDS_ENDPOINT")
  const numiaCosmosHydroAppApiKey = getEnvironmentVariable(
    "NUMIA_COSMOS_HYDRO_APP_API_KEY"
  )
  const hydroContractAddress = getEnvironmentVariable(
    "NEXT_PUBLIC_HYDRO_CONTRACT_ADDRESS"
  )

  if (currentRoundId === roundId) {
    const client = await getCosmWasmClient()
    const hydroQueryClient = new HydroBaseQueryClient(
      client,
      hydroContractAddress
    )

    const query = {
      roundId,
      trancheId,
      numberOfProposals: 1000,
    }

    const { proposals } = await hydroQueryClient.topNProposals(query)

    return proposals
  } else {
    try {
      console.log(`${numiaBidsEndpoint}?round_id=${roundId}`)
      const response = await fetch(`${numiaBidsEndpoint}?round_id=${roundId}`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${numiaCosmosHydroAppApiKey}`,
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
