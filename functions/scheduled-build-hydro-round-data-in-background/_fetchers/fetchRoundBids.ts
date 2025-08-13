import { invariant } from "ts-invariant"
import { HydroBaseQueryClient } from "../../../app/ts_types/HydroBase.client"
import { Proposal } from "../../../app/ts_types/HydroBase.types"
import { getCosmWasmClient } from "../../../contract-apis/getCosmWasmClient"
import { fetchWithRetry } from "@/contract-apis/fetchWithRetry"

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
    "NUMIA_COSMOS_HYDRO_APP_API_KEY is not set",
  )

  invariant(
    hydroContractAddress,
    "NEXT_PUBLIC_HYDRO_CONTRACT_ADDRESS is not set",
  )

  if (currentRoundId === roundId) {
    const client = await getCosmWasmClient()
    const hydroQueryClient = new HydroBaseQueryClient(
      client,
      hydroContractAddress,
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
      const url = `${numiaBidsEndpoint}?round_id=${roundId}&tranche_id=${trancheId}&hydro_contract=${hydroContractAddress}&time=${new Date().getTime()}`

      const response = await fetchWithRetry(url, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${numiaCosmosHydroAppApiKey}`,
        },
      })

      if (!response.ok) {
        throw new Error(
          `Failed to fetch numia round bids data: ${response.statusText}`,
        )
      }

      // Clean up the response
      const responseJson = await response.json()

      if (!Array.isArray(responseJson) || responseJson.length === 0) {
        return []
      }

      if (!responseJson || responseJson.length === 0) {
        return []
      }

      const proposals = JSON.parse(responseJson[0].response).data.proposals

      return proposals as Proposal[]
    } catch (error) {
      throw new Error(`Error fetching bids: ${error}`)
    }
  }
}
