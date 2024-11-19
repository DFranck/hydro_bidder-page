import { HydroBaseQueryClient } from "@/app/ts_types/HydroBase.client"
import { RoundState } from "@/app/types"
import { unstable_cache } from "next/cache"
import { cacheRevalidationInterval } from "./_globals"
import { getCosmWasmClient } from "./getCosmWasmClient"

export const fetchRoundState = async (roundId: number): Promise<RoundState> => {
  if (!process.env.NEXT_PUBLIC_HYDRO_CONTRACT_ADDRESS) {
    throw new Error("Hydro contract address not set")
  }

  const client = await getCosmWasmClient()
  const hydroQueryClient = new HydroBaseQueryClient(
    client,
    process.env.NEXT_PUBLIC_HYDRO_CONTRACT_ADDRESS
  )

  const [roundEnd, totalVotingPower] = await Promise.all([
    unstable_cache(
      async () => {
        return hydroQueryClient
          .roundEnd({ roundId })
          .then((response) => response.round_end)
      },
      ["roundEnd", roundId.toString()],
      { revalidate: cacheRevalidationInterval }
    )(),
    unstable_cache(
      async () => {
        return hydroQueryClient
          .roundTotalVotingPower({ roundId })
          .then((response) => response.total_voting_power)
      },
      ["roundTotalVotingPower", roundId.toString()],
      { revalidate: cacheRevalidationInterval }
    )(),
  ])

  return {
    roundEnd,
    totalVotingPower: BigInt(totalVotingPower),
  }
}
