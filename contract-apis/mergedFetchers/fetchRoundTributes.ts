import { TributeBaseQueryClient } from "../../app/ts_types/TributeBase.client"
import { Tribute } from "../../app/ts_types/TributeBase.types"
import { getCosmWasmClient } from "../getCosmWasmClient"

export async function fetchRoundTributes(
  roundId: number,
  currentRoundId: number,
): Promise<Tribute[]> {


  if (currentRoundId == roundId) {

    /*if (!process.env.NEXT_PUBLIC_TRIBUTE_CONTRACT_ADDRESS) {
      throw new Error("Tribute contract address not set")
    }*/

    const client = await getCosmWasmClient()
    const tributeQueryClient = new TributeBaseQueryClient(
      client,
      'neutron1zy38lczkv82c6kkv5rccpnlltjtaz5cl4wc79mwgrtchtwdsc72skwe58t' //process.env.NEXT_PUBLIC_TRIBUTE_CONTRACT_ADDRESS
    )

    const query = {
      roundId,
      limit: 1000,
      startFrom: 0,
    }

    const { tributes } = await tributeQueryClient.roundTributes(query)

    return tributes
    
  } else {

    const endpoint = 'https://cosmos.numia.xyz/hydro/round_tributes'
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
      throw new Error(`Failed to fetch numia tribute data: ${response.statusText}`)
    }

    // Clean up the response
    const responseJson = await response.json()
    const tributes = JSON.parse(responseJson[0].response).data.tributes;
    return tributes as Tribute[];
  }
}
