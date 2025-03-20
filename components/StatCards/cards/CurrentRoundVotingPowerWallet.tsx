"use client"

import { Icon } from "@/components/Icon"
import { Tooltip } from "@/components/Tooltip"
import { yourVotingPowerTooltip } from "@/components/ToolTips"
import { useBackendData } from "@/contract-apis/useBackendData"
import { formatAmount } from "@/lib/formatAmount"
import { StatCard } from "../StatCard"

export function CurrentRoundVotingPowerWallet() {
  const {
    isLoading,
    votingPowerAvailable,
    votingPowerSpent,
    votingPowerTotal,
    tranches,
    lockups,
  } = useBackendData()

  const hasVotingPowerOfAnyKind = votingPowerTotal > 0

  const hasVotingPowerAvailable = votingPowerAvailable > 0

  const hasVotingPowerButNoneAvailable =
    hasVotingPowerOfAnyKind && votingPowerSpent === votingPowerTotal

  const hasAllVotingPowerAvailable =
    hasVotingPowerOfAnyKind && votingPowerAvailable === votingPowerTotal

  const hasVotingPowerAvailableButNotAll =
    hasVotingPowerAvailable && !hasAllVotingPowerAvailable

  const votingEligibilityByTrancheId = Object.fromEntries(
    tranches.map((tranche) => {
      const hasAvailableLockupInTranche = lockups.some(
        (lockup) => lockup.metaDataByTrancheId[tranche.id].isEligibleToVote
      )

      return [tranche.id, hasAvailableLockupInTranche]
    })
  )

  const canVoteInAllTranches = Object.values(
    votingEligibilityByTrancheId
  ).every((isEligibleToVote) => isEligibleToVote)

  const canVoteInSomeTranches = Object.values(
    votingEligibilityByTrancheId
  ).some((isEligibleToVote) => isEligibleToVote)

  const hasVotedInEveryTrancheThisRound = Object.values(
    votingEligibilityByTrancheId
  ).every((isEligibleToVote) => !isEligibleToVote)

  return (
    <StatCard
      isLoading={isLoading}
      value={formatAmount(votingPowerAvailable, 0, 4)}
      title={
        <Tooltip
          tipContents={yourVotingPowerTooltip({
            canVoteInAllTranches,
            canVoteInSomeTranches,
            hasAllVotingPowerAvailable,
            hasVotedInEveryTrancheThisRound,
            hasVotingPowerAvailableButNotAll,
            hasVotingPowerButNoneAvailable,
            hasVotingPowerOfAnyKind,
            votingPowerAvailable,
            votingPowerSpent,
            votingPowerTotal,
          })}
          classNamesForTooltip="w-72"
        >
          <div className="flex items-center gap-1">
            <span>Available Voting Power</span>
            <Icon name="circle-info" />
          </div>
        </Tooltip>
      }
      subTitle={<span>{formatAmount(votingPowerTotal, 0, 4)} Total</span>}
    />
  )
}
