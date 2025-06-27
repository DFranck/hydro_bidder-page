"use server"

import { fetchDenomTrace } from "@/app/(with-backend-data)/lock-atom/transactions/fetchDenomTrace"
import { Tranche } from "@/app/ts_types/HydroBase.types"
import {
  getGatekeeperQueryClient,
  getHydroQueryClient,
  getTributeQueryClient,
} from "@/contract-apis/getClient"
import { RawWalletData, RoundPrices, MaxUserCanLockResponse } from "@/contract-apis/types"
import range from "lodash/range"
import { getCoinWithRoundPrices } from "./getCoinWithRoundPrices"
import { CurrentEpochUserLockedResponse } from "@/app/ts_types/GatekeeperBase.types"
import { getMaxUserCanLock } from "./getMaxUserCanLock"

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
  const gatekeeperQueryClient = await getGatekeeperQueryClient()
  const { gatekeeper: gatekeeperContractAddress } =
    await hydroQueryClient.gatekeeper()
  const allRoundIds = range(0, currentRoundId + 1)
  const trancheIds = tranches.map((tranche) => tranche.id)
  const allRoundTrancheIdPairs = allRoundIds.flatMap((roundId) =>
    trancheIds.map((trancheId) => ({ roundId, trancheId }))
  )

  const [{ voting_power }, { claims: historical_tribute_claims }] =
    await Promise.all([
      hydroQueryClient
        .userVotingPower({ address })
        .catch(() => ({ voting_power: 0 })),
      tributeQueryClient
        .historicalTributeClaims({
          limit: 100,
          startFrom: 0,
          userAddress: address,
        })
        .catch(() => ({ claims: [] })),
    ])

  // Manual pagination for lockups_with_per_tranche_infos
  const limit = 8
  let startFrom = 0
  const accumulatedLockups = []

  while (true) {
    const { lockups_with_per_tranche_infos } = await hydroQueryClient
      .allUserLockupsWithTrancheInfos({ address, limit, startFrom })
      .catch(() => ({ lockups_with_per_tranche_infos: [] }))

    if (!lockups_with_per_tranche_infos.length) break

    accumulatedLockups.push(...lockups_with_per_tranche_infos)
    startFrom += limit
  }

  let currently_locked: number | string = "0"
  let maxUserCanLockResponse: MaxUserCanLockResponse | undefined
  if (gatekeeperContractAddress) {
    const currentlyLockedResponse = await gatekeeperQueryClient
      .currentEpochUserLocked({
        userAddress: address,
      })
      .catch(
        () => ({ currently_locked: "0" }) as CurrentEpochUserLockedResponse
      )
    currently_locked = currentlyLockedResponse.currently_locked

    maxUserCanLockResponse = await getMaxUserCanLock(address).catch(
      () => ({ address: "", amount: "" }) as MaxUserCanLockResponse
    )
  }

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
    accumulatedLockups.map(async (lockup) => {
      const funds = lockup.lock_with_power.lock_entry.funds
      const denomTrace = await fetchDenomTrace(funds)

      return {
        ...lockup,
        lock_with_power: {
          ...lockup.lock_with_power,
          lock_entry: {
            ...lockup.lock_with_power.lock_entry,
            funds: {
              ...getCoinWithRoundPrices({
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
    currently_locked,
    maxUserCanLock: maxUserCanLockResponse?.amount || "",
    hasGatekeeper: !!gatekeeperContractAddress,
  }
}
