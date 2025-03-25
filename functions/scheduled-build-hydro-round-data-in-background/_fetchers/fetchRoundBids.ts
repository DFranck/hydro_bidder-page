import { invariant } from "ts-invariant"
import { HydroBaseQueryClient } from "../../../app/ts_types/HydroBase.client"
import { Proposal } from "../../../app/ts_types/HydroBase.types"
import { getCosmWasmClient } from "../../../contract-apis/getCosmWasmClient"

export async function fetchRoundBids({
  roundId,
  trancheId,
  currentRoundId,
}: {
  roundId: number
  trancheId: number
  currentRoundId: number
}): Promise<Proposal[]> {
  const numiaBidsEndpoint = process.env.NUMIA_BIDS_ENDPOINT

  const numiaCosmosHydroAppApiKey = process.env.NUMIA_COSMOS_HYDRO_APP_API_KEY

  const hydroContractAddress = process.env.NEXT_PUBLIC_HYDRO_CONTRACT_ADDRESS

  invariant(numiaBidsEndpoint, "NUMIA_BIDS_ENDPOINT is not set")

  invariant(
    numiaCosmosHydroAppApiKey,
    "NUMIA_COSMOS_HYDRO_APP_API_KEY is not set"
  )

  invariant(
    hydroContractAddress,
    "NEXT_PUBLIC_HYDRO_CONTRACT_ADDRESS is not set"
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
      limit: 1000,
      startFrom: 0,
    }

    const { proposals } = await hydroQueryClient.roundProposals(query)

    return proposals
  } else {
    try {
      const url = `${numiaBidsEndpoint}?round_id=${roundId}&time=${new Date().getTime()}`

      console.log(url)

      const response = await fetch(url, {
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
