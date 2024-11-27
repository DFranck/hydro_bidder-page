import { HydroBaseQueryClient } from "@/app/ts_types/HydroBase.client"
import { TributeBaseQueryClient } from "@/app/ts_types/TributeBase.client"
import { BackendData } from "@/contract-apis/fetchBackendDataWithoutAddress"
import { getCosmWasmClient } from "@/contract-apis/getCosmWasmClient"
import { sumBy } from "lodash"

export async function fetchBackendDataWithAddress({
  address,
  globalBackendData,
}: {
  address: string
  globalBackendData: BackendData
}) {
  if (!process.env.NEXT_PUBLIC_HYDRO_CONTRACT_ADDRESS) {
    throw new Error("Hydro contract address not set")
  }

  if (!process.env.NEXT_PUBLIC_TRIBUTE_CONTRACT_ADDRESS) {
    throw new Error("Tribute contract address not set")
  }

  const cosmWasmClient = await getCosmWasmClient()

  const tributeQueryClient = new TributeBaseQueryClient(
    cosmWasmClient,
    process.env.NEXT_PUBLIC_TRIBUTE_CONTRACT_ADDRESS
  )

  const hydroQueryClient = new HydroBaseQueryClient(
    cosmWasmClient,
    process.env.NEXT_PUBLIC_HYDRO_CONTRACT_ADDRESS
  )

  const { bidsByRoundId, currentRoundMetadata } = globalBackendData

  const { roundId, tranches } = currentRoundMetadata

  const [{ voting_power: votingPower }, { lockups }] = await Promise.all([
    hydroQueryClient.userVotingPower({ address }),
    hydroQueryClient.allUserLockups({
      address,
      limit: 10_000,
      startFrom: 0,
    }),
  ])

  const votes = await Promise.all(
    tranches.map(async (tranche) => {
      const { votes } = await hydroQueryClient.userVotes({
        address,
        roundId,
        trancheId: tranche.id,
      })
      return votes
    })
  )

  return {
    ...globalBackendData,
    bidsByRoundId,
    currentRoundMetadata: {
      ...currentRoundMetadata,
      votes,
      votingPower,
    },
    lockups: {
      count: lockups.length,
      lockups,
      totalAtomLocked: sumBy(lockups, "lock_entry.funds.amount"),
    },
  }
}
