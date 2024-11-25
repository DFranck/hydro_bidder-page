"use client"

import { Icon } from "@/components/Icon"
import { Tooltip } from "@/components/Tooltip"
import { yourVotingPowerTooltip } from "@/components/ToolTips"
import { useContractContext } from "@/contract-apis/useContractContext"
import { StatCard } from "../StatCard"

export function YourVotingPower() {
  const { isLoading, currentRoundMetadata } = useContractContext()

  const { usersVotingPower } = currentRoundMetadata

  return (
    <StatCard
      isLoading={isLoading}
      value={usersVotingPower}
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
