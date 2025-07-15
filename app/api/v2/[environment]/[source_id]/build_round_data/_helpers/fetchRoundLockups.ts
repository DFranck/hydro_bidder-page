import { getHydroQueryClient } from "@/app/api/v2/_helpers/getHydroQueryClient"
import { LockupWithPerTrancheInfo } from "@/app/ts_types/HydroBase.types"
import { fetchHistoricUsers } from "./fetchHistoricUsers"

export async function fetchRoundLockups({
  hydroContract,
  roundId,
  currentRoundId,
}: {
  hydroContract: string
  roundId: number
  currentRoundId: number
}): Promise<LockupWithPerTrancheInfo[][]> {
  if (currentRoundId == roundId) {
    const { users } = await fetchHistoricUsers({ hydroContract })

    const hydroQueryClient = await getHydroQueryClient({
      hydroContract,
    })

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
    const url = new URL("/hydro/v2/round_lockups", "https://cosmos.numia.xyz")
    url.searchParams.append("hydro_contract", hydroContract)
    url.searchParams.append("round_id", roundId.toString())

    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${process.env.NUMIA_COSMOS_HYDRO_APP_API_KEY}`,
      },
    })

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
