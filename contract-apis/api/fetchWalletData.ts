"use server"

import range from "lodash/range"

import { HydroBaseQueryClient } from "@/app/ts_types/HydroBase.client"
import { Tranche, VoteWithPower } from "@/app/ts_types/HydroBase.types"
import { fetchClaims } from "@/contract-apis/fetchClaims"
import { fetchWalletLockups } from "@/contract-apis/fetchWalletLockups"
import { getCosmWasmClient } from "@/contract-apis/getCosmWasmClient"

export async function fetchWalletData({
  address,
  currentRoundId,
  tranches,
}: {
  address: string
  currentRoundId: number
  tranches: Tranche[]
}) {
  if (!process.env.NEXT_PUBLIC_HYDRO_CONTRACT_ADDRESS) {
    throw new Error("Hydro contract address not set")
  }

  const cosmWasmClient = await getCosmWasmClient()
  const hydroQueryClient = new HydroBaseQueryClient(
    cosmWasmClient,
    process.env.NEXT_PUBLIC_HYDRO_CONTRACT_ADDRESS
  )

  // [0, 1, 2, ...currentRoundId]
  const allRoundIds = range(0, currentRoundId + 1)

  const [
    { voting_power: votingPowerFromContract },
    sanitizedLockups,
    votes,
    claims,
  ] = await Promise.all([
    hydroQueryClient.userVotingPower({ address }),
    fetchWalletLockups({ address, currentRoundId }),
    Promise.all(
      allRoundIds.map(async (roundId) =>
        Promise.all(
          tranches.map(async (tranche) => {
            let fetchedVotes = [] as VoteWithPower[]
            try {
              const { votes: votesForTranche } =
                await hydroQueryClient.userVotes({
                  address,
                  roundId,
                  trancheId: tranche.id,
                })
              fetchedVotes = votesForTranche
            } catch (err) {
              // TODO: no votes for this tranche; shouldn't throw exception though??
            }
            return fetchedVotes
          })
        )
      )
    ),
    fetchClaims({
      address,
      currentRoundId,
      trancheIds: tranches.map((tranche) => tranche.id),
    }),
  ])

  return {
    votingPowerFromContract,
    sanitizedLockups,
    votes: votes.flat().flat(),
    claims,
  }
}
