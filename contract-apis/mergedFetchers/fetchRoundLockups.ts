"use server"

import { HydroBaseQueryClient } from "@/app/ts_types/HydroBase.client"
import { LockupWithPerTrancheInfo } from "@/app/ts_types/HydroBase.types"
import { getCosmWasmClient } from "@/contract-apis/getCosmWasmClient"
import { fetchHistoricUsers } from "@/contract-apis/mergedFetchers/fetchHistoricUsers"
import "server-only"

export async function fetchRoundLockups(
  roundId: number,
  currentRoundId: number
): Promise<LockupWithPerTrancheInfo[][]> {
  if (currentRoundId == roundId) {
    if (!process.env.NEXT_PUBLIC_HYDRO_CONTRACT_ADDRESS) {
      throw new Error("Hydro contract address not set")
    }

    const { users } = await fetchHistoricUsers()

    const client = await getCosmWasmClient()
    const hydroQueryClient = new HydroBaseQueryClient(
      client,
      process.env.NEXT_PUBLIC_HYDRO_CONTRACT_ADDRESS
    )

    const allUserLockupsWithTrancheInfos = await Promise.all(
      users.map(async (address) => {
        const query = {
          address,
          limit: 1000,
          startFrom: 0,
        }

        const { lockups_with_per_tranche_infos } =
          await hydroQueryClient.allUserLockupsWithTrancheInfos(query)
        return lockups_with_per_tranche_infos
      })
    )

    return allUserLockupsWithTrancheInfos
  } else {
    if (!process.env.NUMIA_LOCKUPS_ENDPOINT) {
      throw new Error("NUMIA_LOCKUPS_ENDPOINT is not set")
    }

    const response = await fetch(
      `${process.env.NUMIA_LOCKUPS_ENDPOINT}?round_id=${roundId}`,
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_NUMIA_COSMOS_HYDRO_APP_API_KEY}`,
        },
      }
    )

    if (!response.ok) {
      throw new Error(
        `Failed to fetch numia lockups data: ${response.statusText}`
      )
    }

    // Clean up the response
    const responseJson = await response.json()
    if (responseJson.length == 0) {
      return []
    }

    const tributes = responseJson.map((response: { response: string }) => {
      return JSON.parse(response.response).data.lockups_with_per_tranche_infos
    })
    return tributes as LockupWithPerTrancheInfo[][]
  }
}
