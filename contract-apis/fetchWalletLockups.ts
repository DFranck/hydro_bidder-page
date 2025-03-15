"use server"

import { HydroBaseQueryClient } from "@/app/ts_types/HydroBase.client"
import { LockupWithPerTrancheInfo } from "@/app/ts_types/HydroBase.types"
import { getDaysAway } from "@/lib/getDaysAway"
import { getCosmWasmClient } from "./getCosmWasmClient"
import { endpointsShared } from "@/config"

export interface SanitizedLockup {
  id: number
  currentVotingPower: number
  dateEnd: Date
  dateStart: Date
  daysLeft: number
  funds: {
    amount: number
    denom: string
  }
  isExpired: boolean
  isEligibleThisRoundAtAll: boolean
  isEligibleToChangeVote: boolean
  isEligibleButHasNotVoted: boolean
  isTiedToDeployment: boolean
  multiplier: number
  metaDataByTrancheId: Record<
    number,
    {
      nextRoundEligibleToVote: number | null
      votedOnBidId: number | null
    }
  >
  nextRoundEligibleToVote: number | null
  numRoundsLeftOnDeployment: number
  votedOnBidId: number | null
}

function sanitizeLockup(
  lockup: LockupWithPerTrancheInfo,
  currentRoundId: number
): SanitizedLockup {
  const dateEnd = new Date(
    Number(lockup.lock_with_power.lock_entry.lock_end) / 1e6
  )

  const daysLeft = getDaysAway(dateEnd)

  const isExpired = new Date() > dateEnd

  const votedOnBidId =
    Object.values(lockup.per_tranche_info).find(
      (trancheInfo) => trancheInfo.current_voted_on_proposal !== null
    )?.current_voted_on_proposal ?? null

  const nextRoundEligibleToVote =
    Object.values(lockup.per_tranche_info).find(
      (trancheInfo) => trancheInfo.next_round_lockup_can_vote !== null
    )?.next_round_lockup_can_vote ?? null

  const isEligibleThisRoundAtAll =
    !isExpired &&
    !!nextRoundEligibleToVote &&
    nextRoundEligibleToVote <= currentRoundId

  const isEligibleToChangeVote = isEligibleThisRoundAtAll && !!votedOnBidId

  const isEligibleButHasNotVoted = isEligibleThisRoundAtAll && !votedOnBidId

  const isTiedToDeployment =
    !isExpired &&
    !!nextRoundEligibleToVote &&
    nextRoundEligibleToVote > currentRoundId

  const numRoundsLeftOnDeployment = isTiedToDeployment
    ? nextRoundEligibleToVote - currentRoundId
    : -1

  return {
    id: lockup.lock_with_power.lock_entry.lock_id,
    currentVotingPower: Number(lockup.lock_with_power.current_voting_power),
    dateEnd,
    dateStart: new Date(
      Number(lockup.lock_with_power.lock_entry.lock_start) / 1e6
    ),
    daysLeft,
    funds: {
      amount: Number(lockup.lock_with_power.lock_entry.funds.amount) / 1e6,
      denom: lockup.lock_with_power.lock_entry.funds.denom,
    },
    isEligibleThisRoundAtAll,
    isEligibleToChangeVote,
    isEligibleButHasNotVoted,
    isExpired,
    isTiedToDeployment,
    multiplier: Number(
      (
        Number(lockup.lock_with_power.current_voting_power) /
        Number(lockup.lock_with_power.lock_entry.funds.amount)
      ).toFixed(2)
    ),
    metaDataByTrancheId: Object.fromEntries(
      lockup.per_tranche_info.map((trancheInfo) => [
        trancheInfo.tranche_id,
        {
          nextRoundEligibleToVote:
            trancheInfo.next_round_lockup_can_vote ?? null,
          votedOnBidId: trancheInfo.current_voted_on_proposal ?? null,
        },
      ])
    ),
    nextRoundEligibleToVote,
    numRoundsLeftOnDeployment,
    votedOnBidId,
  }
}

export async function fetchWalletLockups({
  address,
  currentRoundId,
}: {
  address: string
  currentRoundId: number
}) {
  if (!process.env.NEXT_PUBLIC_HYDRO_CONTRACT_ADDRESS) {
    throw new Error("Hydro contract address not set")
  }

  const neutronRpcEndpoint = endpointsShared.neutron.rpc[0]

  const client = await getCosmWasmClient({
    endpoint: neutronRpcEndpoint,
  })
  const hydroQueryClient = new HydroBaseQueryClient(
    client,
    process.env.NEXT_PUBLIC_HYDRO_CONTRACT_ADDRESS
  )

  const lockupsWithPerTrancheInfo =
    await hydroQueryClient.allUserLockupsWithTrancheInfos({
      address,
      limit: 10_000,
      startFrom: 0,
    })

  return lockupsWithPerTrancheInfo.lockups_with_per_tranche_infos.map(
    (unsanitizedLockup) => sanitizeLockup(unsanitizedLockup, currentRoundId)
  )
}
