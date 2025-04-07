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
    votingPowerAvailableByTrancheId,
    votingPowerSpentByTrancheId,
    votingPowerTotal,
    tranches,
    lockups,
    isWalletConnected,
  } = useBackendData()

  const votingEligibilityByTrancheId = Object.fromEntries(
    tranches.map((tranche) => {
      const hasAvailableLockupInTranche = lockups.some(
        (lockup) => lockup.metaDataByTrancheId[tranche.id].isEligibleToVote,
      )

      return [tranche.id, hasAvailableLockupInTranche]
    }),
  )

  const votingPowerByTranche = tranches.reduce(
    (acc, tranche) => {
      if (!acc[tranche.id]) {
        acc[tranche.id] = {
          name: "",
          votingPowerAvailable: 0,
          votingPowerSpent: 0,
        }
      }

      acc[tranche.id] = {
        name: tranche.name,
        votingPowerAvailable: votingPowerAvailableByTrancheId[tranche.id],
        votingPowerSpent: votingPowerSpentByTrancheId[tranche.id],
      }
      return acc
    },
    {} as {
      [trancheId: string]: {
        name: string
        votingPowerAvailable: number
        votingPowerSpent: number
      }
    },
  )

  const hasSpentAnyVotingPowerInAnyTranche = Object.values(
    votingPowerByTranche,
  ).some((x) => x.votingPowerSpent > 0)

  const canVoteInAllTranches = Object.values(
    votingEligibilityByTrancheId,
  ).every((isEligibleToVote) => isEligibleToVote)

  const canVoteInSomeTranches = Object.values(
    votingEligibilityByTrancheId,
  ).some((isEligibleToVote) => isEligibleToVote)

  const hasVotedInEveryTrancheThisRound = Object.values(
    votingEligibilityByTrancheId,
  ).every((isEligibleToVote) => !isEligibleToVote)

  return (
    <StatCard
      isLoading={isLoading}
      value={formatAmount(votingPowerTotal, 0, votingPowerTotal < 0.01 ? 4 : 2)}
      title={
        <Tooltip
          tipContents={yourVotingPowerTooltip({
            canVoteInAllTranches,
            canVoteInSomeTranches,
            hasVotedInEveryTrancheThisRound,
            votingPowerTotal,
            hasSpentAnyVotingPowerInAnyTranche,
            isWalletConnected,
            votingPowerByTranche,
          })}
          classNamesForTooltip="w-72"
        >
          <div className="flex items-center gap-1">
            <span>Total Voting Power</span>
            <Icon name="circle-info" />
          </div>
        </Tooltip>
      }
    />
  )
}
