"use client"

import { Icon } from "@/components/Icon"
import { Tooltip } from "@/components/Tooltip"
import { averageAPRTooltip } from "@/components/ToolTips"
import { useBackendData } from "@/contract-apis/useBackendData"
import { sumBy } from "lodash"
import { StatCard } from "../StatCard"

export function CurrentRoundAprGlobal() {
  const {
    atomPrice,
    bidsByRoundId,
    currentRoundId,
    isLoading,
    lockedAtomTotalGlobal,
  } = useBackendData()
  const bids = bidsByRoundId[currentRoundId] ?? []
  const totalTributeValue = sumBy(
    bids.map((bid) => bid.tributes).flat(),
    "valueInUsd"
  )
  const averageBidDurationInEpochs =
    sumBy(bids, "deploymentDurationInEpochs") / bids.length
  const averageAPR =
    ((totalTributeValue / (lockedAtomTotalGlobal / 1e6) / atomPrice) * 12) /
      averageBidDurationInEpochs || 0

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
      subTitle={`Pilot Round ${currentRoundId + 1}`}
      value={averageAPR.toLocaleString("en-US", {
        style: "percent",
      })}
    />
  )
}
