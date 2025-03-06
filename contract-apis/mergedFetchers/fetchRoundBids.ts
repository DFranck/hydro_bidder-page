import { HydroBaseQueryClient } from "@/app/ts_types/HydroBase.client"
import { Proposal } from "@/app/ts_types/HydroBase.types"
import { getCosmWasmClient } from "@/contract-apis/getCosmWasmClient"

export async function fetchRoundBids(
  roundId: number,
  trancheId: number,
  currentRoundId: number
): Promise<Proposal[]> {
  if (currentRoundId == roundId) {
    if (!process.env.NEXT_PUBLIC_HYDRO_CONTRACT_ADDRESS) {
      throw new Error("Hydro contract address not set")
    }

    const client = await getCosmWasmClient()
    const hydroQueryClient = new HydroBaseQueryClient(
      client,
      process.env.NEXT_PUBLIC_HYDRO_CONTRACT_ADDRESS
    )

    const query = {
      roundId,
      trancheId,
      numberOfProposals: 1000,
    }

    const { proposals } = await hydroQueryClient.topNProposals(query)

    return proposals
  } else {
    if (!process.env.NUMIA_BIDS_ENDPOINT) {
      throw new Error("NUMIA_DEPLOYMENTS_OVERVIEW_ENDPOINT is not set")
    }

    const response = await fetch(
      `${process.env.NUMIA_BIDS_ENDPOINT}?round_id=${roundId}`,
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${process.env.NUMIA_COSMOS_HYDRO_APP_API_KEY}`,
        },
      }
    )

    if (!response.ok) {
      throw new Error(`Failed to fetch numia bids data: ${response.statusText}`)
    }

    // Clean up the response
    const responseJson = await response.json()
    const proposals = JSON.parse(responseJson[0].response).data.proposals
    return proposals as Proposal[]
  }
}
