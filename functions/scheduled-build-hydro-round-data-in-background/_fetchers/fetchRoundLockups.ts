import { invariant } from "ts-invariant"
import { HydroBaseQueryClient } from "../../../app/ts_types/HydroBase.client"
import { LockupWithPerTrancheInfo } from "../../../app/ts_types/HydroBase.types"
import { getCosmWasmClient } from "../../../contract-apis/getCosmWasmClient"
import { fetchHistoricUsers } from "./fetchHistoricUsers"

export async function fetchRoundLockups({
  roundId,
  currentRoundId,
}: {
  roundId: number
  currentRoundId: number
}): Promise<LockupWithPerTrancheInfo[][]> {
  const numiaCosmosHydroAppApiKey = process.env.NUMIA_COSMOS_HYDRO_APP_API_KEY

  const numiaLockupsEndpoint = process.env.NUMIA_LOCKUPS_ENDPOINT

  const hydroContractAddress = process.env.NEXT_PUBLIC_HYDRO_CONTRACT_ADDRESS

  invariant(
    numiaCosmosHydroAppApiKey,
    "NUMIA_COSMOS_HYDRO_APP_API_KEY is not set"
  )

  invariant(numiaLockupsEndpoint, "NUMIA_LOCKUPS_ENDPOINT is not set")

  invariant(
    hydroContractAddress,
    "NEXT_PUBLIC_HYDRO_CONTRACT_ADDRESS is not set"
  )

  if (currentRoundId == roundId) {
    const { users } = await fetchHistoricUsers()

    const client = await getCosmWasmClient()
    const hydroQueryClient = new HydroBaseQueryClient(
      client,
      hydroContractAddress
    )

    const allUserLockupsWithTrancheInfos = []
    for (let i = 0; i < users.length; i += 10) {
      const userBatch = users.slice(i, i + 10)
      const batchLockups = await Promise.all(
        userBatch.map(async (address) => {
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
      allUserLockupsWithTrancheInfos.push(...batchLockups)
    }

    return allUserLockupsWithTrancheInfos
  } else {
    const response = await fetch(
      `${numiaLockupsEndpoint}?round_id=${roundId}`,
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${numiaCosmosHydroAppApiKey}`,
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
      return (
        JSON.parse(response.response).data?.lockups_with_per_tranche_infos ?? []
      )
    })
    return tributes as LockupWithPerTrancheInfo[][]
  }
}
