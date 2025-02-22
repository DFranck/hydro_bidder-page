"use server"

import { LockupWithPerTrancheInfo } from "@/app/ts_types/HydroBase.types"
import { SanitizedLockup } from "@/contract-apis/types"
import { getDaysAway } from "@/lib/getDaysAway"

export function augmentLockup(
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
