"use client"

import { Icon } from "@/components/Icon"
import { Tooltip } from "@/components/Tooltip"
import { yourVotingPowerTooltip } from "@/components/ToolTips"
import { useBackendData } from "@/contract-apis/useBackendData"
import { StatCard } from "../StatCard"

export function CurrentRoundVotingPowerWallet() {
  const { isLoading, votingPower } = useBackendData()

  return (
    <StatCard
      isLoading={isLoading}
      value={votingPower.toFixed(4)}
      title={
        <Tooltip tipContents={yourVotingPowerTooltip}>
          <div className="flex items-center gap-1">
            <span>Your Voting Power</span>
            <Icon name="circle-info" />
          </div>
        </Tooltip>
      }
      subTitle={<span>Current</span>}
    />
  )
}
