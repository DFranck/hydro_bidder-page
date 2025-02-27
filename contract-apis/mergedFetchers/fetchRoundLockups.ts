import { HydroBaseQueryClient } from "../../app/ts_types/HydroBase.client"
import { LockupWithPerTrancheInfo } from "../../app/ts_types/HydroBase.types"
import { getCosmWasmClient } from "../getCosmWasmClient"
import { addresses } from "../auxFiles/hydro_lockers"

export async function fetchRoundLockups(
  roundId: number,
  currentRoundId: number,
): Promise<LockupWithPerTrancheInfo[][]> {

  if (currentRoundId == roundId) {

    /*if (!process.env.NEXT_PUBLIC_TRIBUTE_CONTRACT_ADDRESS) {
      throw new Error("Tribute contract address not set")
    }*/

    const client = await getCosmWasmClient()
    const hydroQueryClient = new HydroBaseQueryClient(
      client,
      'neutron13w6sagl4clacx4c8drhuwfl20cesn3pnllhf37e65ls8zwf6gcgq93t2lp' //process.env.NEXT_PUBLIC_TRIBUTE_CONTRACT_ADDRESS
    )

    const allUserLockupsWithTrancheInfos = addresses.map(async (address) => {
      const query = {
        address,
        limit: 1000,
        startFrom: 0,
      }

      const { lockups_with_per_tranche_infos } = await hydroQueryClient.allUserLockupsWithTrancheInfos(query)

      return lockups_with_per_tranche_infos
    })

    return Promise.all(allUserLockupsWithTrancheInfos)
    
  } else {

    const endpoint = 'https://cosmos.numia.xyz/hydro/round_lockups'
    const bearer = 'bearer'
    /*if (!process.env.NUMIA_DEPLOYMENTS_OVERVIEW_ENDPOINT) {
      throw new Error("NUMIA_DEPLOYMENTS_OVERVIEW_ENDPOINT is not set")
    }*/

    const allUserLockupsWithTrancheInfos = addresses.map(async (address) => {
      const response = await fetch(
        `${endpoint}?round_id=${roundId}&address=${address}&`, 
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${bearer}`,
          },
        }
      )

      if (!response.ok) {
        throw new Error(`Failed to fetch numia lockups data: ${response.statusText}`)
      }

      // Clean up the response
      const responseJson = await response.json()
      if (responseJson.length == 0) {
        return []
      }
      const tributes = JSON.parse(responseJson[0].response).data.lockups_with_per_tranche_infos;
      return tributes as LockupWithPerTrancheInfo[];
    })

    return Promise.all(allUserLockupsWithTrancheInfos)
  }
}
