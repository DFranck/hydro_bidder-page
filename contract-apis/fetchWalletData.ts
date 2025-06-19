"use server"

import { fetchDenomTrace } from "@/app/(with-backend-data)/lock-atom/transactions/fetchDenomTrace"
import { Tranche } from "@/app/ts_types/HydroBase.types"
import {
  getHydroQueryClient,
  getTributeQueryClient,
} from "@/contract-apis/getClient"
import { RawWalletData, RoundPrices } from "@/contract-apis/types"
import range from "lodash/range"
import { getCoinWithRoundPrices } from "./getCoinWithRoundPrices"

export async function fetchWalletData({
  address,
  currentRoundId,
  tranches,
  currentRoundPrices,
}: {
  address: string
  currentRoundId: number
  tranches: Tranche[]
  currentRoundPrices: RoundPrices
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

  const LOCKUPS_WITH_TRANCHES_INFO = await Promise.all(
    lockups_with_per_tranche_infos.map(async (lockup) => {
      const funds = lockup.lock_with_power.lock_entry.funds
      const denomTrace = await fetchDenomTrace(funds)

      return {
        ...lockup,
        lock_with_power: {
          ...lockup.lock_with_power,
          lock_entry: {
            ...lockup.lock_with_power.lock_entry,
            funds: {
              ...funds,
              denom: funds.denom,
              denomInfo: getCoinWithRoundPrices({
                coin: funds,
                roundPrices: currentRoundPrices,
                validator: denomTrace?.validator,
              }),
            },
          },
        },
      }
    })
  )

  return {
    voting_power,
    lockups_with_per_tranche_infos: LOCKUPS_WITH_TRANCHES_INFO,
    votes,
    outstanding_tribute_claims,
    historical_tribute_claims,
  }
}
