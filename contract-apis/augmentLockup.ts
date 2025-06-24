import {
  AugmentedLockup,
  AugmentedLockupWithPerTrancheInfo,
} from "@/contract-apis/types"
import { getDaysAway } from "@/lib/getDaysAway"

export function augmentLockup(
  lockup: AugmentedLockupWithPerTrancheInfo,
  currentRoundId: number
): AugmentedLockup {
  const dateEnd = new Date(
    Number(lockup.lock_with_power.lock_entry.lock_end) / 1e6
  )

  const daysLeft = getDaysAway(dateEnd)

  const isExpired = new Date() > dateEnd

  const isEligibleToVote = lockup.per_tranche_info.some(
    (trancheInfo) => trancheInfo.next_round_lockup_can_vote <= currentRoundId
  )

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
      denomInfo: lockup.lock_with_power.lock_entry.funds,
    },
    isEligibleToVote,
    isExpired,
    multiplier: Number(
      (
        Number(lockup.lock_with_power.current_voting_power) /
        Number(lockup.lock_with_power.lock_entry.funds.amount)
      ).toFixed(2)
    ),
    metaDataByTrancheId: Object.fromEntries(
      lockup.per_tranche_info.map((trancheInfo) => {
        const votedOnBidId = trancheInfo.current_voted_on_proposal || null

        const nextRoundEligibleToVote =
          trancheInfo.next_round_lockup_can_vote || null

        const isEligibleToVote =
          !isExpired &&
          !!nextRoundEligibleToVote &&
          nextRoundEligibleToVote <= currentRoundId

        const isEligibleToChangeVote = isEligibleToVote && !!votedOnBidId

        const isEligibleButHasNotVoted = isEligibleToVote && !votedOnBidId

        const isTiedToDeployment =
          !isExpired &&
          !!nextRoundEligibleToVote &&
          nextRoundEligibleToVote > currentRoundId

        const numRoundsLeftOnDeployment = isTiedToDeployment
          ? nextRoundEligibleToVote - currentRoundId
          : null

        return [
          trancheInfo.tranche_id,
          {
            isEligibleToVote,
            isEligibleToChangeVote,
            isEligibleButHasNotVoted,
            isTiedToDeployment,
            numRoundsLeftOnDeployment,
            nextRoundEligibleToVote:
              trancheInfo.next_round_lockup_can_vote ?? null,
            votedOnBidId: trancheInfo.current_voted_on_proposal ?? null,
          },
        ]
      })
    ),
  }
}
