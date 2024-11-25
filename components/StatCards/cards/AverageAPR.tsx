"use client"

import { Icon } from "@/components/Icon"
import { Tooltip } from "@/components/Tooltip"
import { averageAPRTooltip } from "@/components/ToolTips"
import { useContractContext } from "@/contract-apis/useContractContext"
import { sumBy } from "lodash"
import { StatCard } from "../StatCard"

export function AverageAPR() {
  const { bidsByRoundId, currentRoundMetadata, isLoading } =
    useContractContext()
  const { averageAPR, roundId } = currentRoundMetadata
  const totalTributeValue = sumBy(
    bidsByRoundId[roundId],
    (bid) => bid.onchainTributeUsdc
  )

  return (
    <StatCard
      isLoading={isLoading}
      title={
        <Tooltip tipContents={averageAPRTooltip}>
          <div className="flex items-center gap-1">
            <span>Average APR</span>
            <Icon name="circle-info" />
          </div>
        </Tooltip>
      }
      subTitle={`Pilot Round ${roundId + 1}`}
      value={averageAPR.toLocaleString("en-US", {
        style: "percent",
      })}
    />
  )
}
