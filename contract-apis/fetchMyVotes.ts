import { HydroBaseQueryClient } from "@/app/ts_types/HydroBase.client"
import { VoteWithPower } from "@/app/ts_types/HydroBase.types"
import { getCosmWasmClient } from "./getCosmWasmClient"

export const fetchMyVotes = async (
  address: string,
  roundId: number,
  trancheIds: number[]
) => {
  if (!process.env.NEXT_PUBLIC_HYDRO_CONTRACT_ADDRESS) {
    throw new Error("Hydro contract address not set")
  }

  const client = await getCosmWasmClient()
  const hydroQueryClient = new HydroBaseQueryClient(
    client,
    process.env.NEXT_PUBLIC_HYDRO_CONTRACT_ADDRESS
  )

  const votePromises = trancheIds.map((trancheId) => {
    try {
      return hydroQueryClient.userVotes({
        address,
        roundId,
        trancheId,
      })
    } catch (err) {
      return {
        vote: null,
      }
    }
  })

  // return all promises resolved or rejected
  const votes = await Promise.allSettled(votePromises)

  const votesByTranche = trancheIds.reduce((acc, trancheId, index) => {
    if (votes[index].status === "fulfilled") {
      acc.set(
        trancheId,
        "vote" in votes[index].value ? votes[index].value.vote : null
      )
    }
    return acc
  }, new Map<number, VoteWithPower | null>())

  return votesByTranche
}
