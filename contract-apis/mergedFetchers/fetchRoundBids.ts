import { HydroBaseQueryClient } from "../../app/ts_types/HydroBase.client"
import { Proposal } from "../../app/ts_types/HydroBase.types"
import { getCosmWasmClient } from "../getCosmWasmClient"

export async function fetchRoundBids(
  roundId: number,
  trancheId: number,
  currentRoundId: number,
): Promise<Proposal[]> {

  if (currentRoundId == roundId) {

    /*if (!process.env.NEXT_PUBLIC_TRIBUTE_CONTRACT_ADDRESS) {
      throw new Error("Tribute contract address not set")
    }*/

    const client = await getCosmWasmClient()
    const hydroQueryClient = new HydroBaseQueryClient(
      client,
      'neutron13w6sagl4clacx4c8drhuwfl20cesn3pnllhf37e65ls8zwf6gcgq93t2lp' //process.env.NEXT_PUBLIC_TRIBUTE_CONTRACT_ADDRESS
    )

    const query = {
      roundId,
      trancheId,
      numberOfProposals: 1000
    }

    const { proposals } = await hydroQueryClient.topNProposals(query)

    return proposals
    
  } else {

    const endpoint = 'https://cosmos.numia.xyz/hydro/round_bids'
    const bearer = 'bearer'
    /*if (!process.env.NUMIA_DEPLOYMENTS_OVERVIEW_ENDPOINT) {
      throw new Error("NUMIA_DEPLOYMENTS_OVERVIEW_ENDPOINT is not set")
    }*/

    const response = await fetch(
      `${endpoint}?round_id=${roundId}`, 
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${bearer}`,
        },
      }
    )

    if (!response.ok) {
      throw new Error(`Failed to fetch numia bids data: ${response.statusText}`)
    }

    // Clean up the response
    const responseJson = await response.json()
    const proposals = JSON.parse(responseJson[0].response).data.proposals;
    return proposals as Proposal[];
  }
}
