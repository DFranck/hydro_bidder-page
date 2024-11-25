"use client"

import { Icon } from "@/components/Icon"
import { Tooltip } from "@/components/Tooltip"
import { yourRoundAPRTooltip } from "@/components/ToolTips"
import { useContractContext } from "@/contract-apis/useContractContext"
import { StatCard } from "../StatCard"

export function YourAPRCurrentRound() {
  const { currentRoundMetadata: roundMetadata } = useContractContext()
  const { roundId: currentRoundId } = roundMetadata

  return (
    <StatCard
      title={
        <Tooltip tipContents={yourRoundAPRTooltip}>
          <div className="flex items-center gap-1">
            <span>Your Round APR</span>
            <Icon name="circle-info" />
          </div>
        </Tooltip>
      }
      subTitle={`Pilot Round ${currentRoundId + 1}`}
      value="–%"
    />
  )
}
