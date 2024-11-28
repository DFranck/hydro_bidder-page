"use client"

import { Icon } from "@/components/Icon"
import { Tooltip } from "@/components/Tooltip"
import { averageAPRTooltip } from "@/components/ToolTips"
import { useBackendData } from "@/contract-apis/useBackendData"
import { sumBy } from "lodash"
import { StatCard } from "../StatCard"

export function AverageRoundApr() {
  const { bidsByRoundId, currentRoundMetadata, globalMetadata, isLoading } =
    useBackendData()
  const { roundId } = currentRoundMetadata
  const { atomPrice, metrics, totalLockedTokens } = globalMetadata
  const { currentRoundTotalAtomLocked } = metrics
  const bids = bidsByRoundId[roundId] ?? []
  const totalTributeValue = sumBy(
    bids.map((bid) => bid.tributes).flat(),
    "valueInUsd"
  )
  const averageAPR = (totalTributeValue / totalLockedTokens / atomPrice) * 12

  console.log({
    totalTributeValue,
    currentRoundTotalAtomLocked,
    totalLockedTokens,
    atomPrice,
    averageAPR,
  })

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
