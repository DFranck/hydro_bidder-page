"use server"

import { Tranche } from "@/app/ts_types/HydroBase.types"
import {
  getHydroQueryClient,
  getTributeQueryClient,
} from "@/contract-apis/getClient"
import { RawWalletData } from "@/contract-apis/types"
import range from "lodash/range"
import "server-only"

export async function fetchWalletData({
  address,
  currentRoundId,
  tranches,
}: {
  address: string
  currentRoundId: number
  tranches: Tranche[]
}): Promise<RawWalletData> {
  const hydroQueryClient = await getHydroQueryClient()
  const tributeQueryClient = await getTributeQueryClient()
  const allRoundIds = range(0, currentRoundId + 1)
  const trancheIds = tranches.map((tranche) => tranche.id)
  const allRoundTrancheIdPairs = allRoundIds.flatMap((roundId) =>
    trancheIds.map((trancheId) => ({ roundId, trancheId }))
  )

  const [
    { voting_power },
    { lockups_with_per_tranche_infos },
    { claims: historical_tribute_claims },
  ] = await Promise.all([
    hydroQueryClient
      .userVotingPower({ address })
      .catch(() => ({ voting_power: 0 })),
    hydroQueryClient
      .allUserLockupsWithTrancheInfos({
        address,
        limit: 10_000,
        startFrom: 0,
      })
      .catch(() => ({ lockups_with_per_tranche_infos: [] })),
    tributeQueryClient
      .historicalTributeClaims({
        limit: 100,
        startFrom: 0,
        userAddress: address,
      })
      .catch(() => ({ claims: [] })),
  ])

  const votesAndClaims = await Promise.all(
    allRoundTrancheIdPairs.map(async ({ roundId, trancheId }) => {
      const [{ votes }, { claims }] = await Promise.all([
        hydroQueryClient
          .userVotes({
            address,
            roundId,
            trancheId,
          })
          .catch(() => ({ votes: [] })),
        tributeQueryClient
          .outstandingTributeClaims({
            limit: 100,
            roundId,
            startFrom: 0,
            trancheId,
            userAddress: address,
          })
          .catch(() => ({ claims: [] })),
      ])
      return { votes, claims }
    })
  )

  const votes = votesAndClaims.flatMap((o) => o.votes)
  const outstanding_tribute_claims = votesAndClaims.flatMap((o) => o.claims)

  return {
    voting_power,
    lockups_with_per_tranche_infos,
    votes,
    outstanding_tribute_claims,
    historical_tribute_claims,
  }
}
