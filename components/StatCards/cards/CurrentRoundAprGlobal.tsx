"use client"

import { Icon } from "@/components/Icon"
import { Tooltip } from "@/components/Tooltip"
import { averageAPRTooltip } from "@/components/ToolTips"
import { useBackendData } from "@/contract-apis/useBackendData"
import sumBy from "lodash/sumBy"
import { StatCard } from "../StatCard"

export function CurrentRoundAprGlobal() {
  const {
    atomPrice,
    bidsByRoundId,
    currentRoundId,
    isLoading,
    lockedAtomTotalGlobal,
    metricsGlobal,
  } = useBackendData()
  const bids = bidsByRoundId[currentRoundId] ?? []
  const totalTributeValue = sumBy(
    bids.map((bid) => bid.tributes).flat(),
    "valueUsd"
  )
  const averageBidDurationInEpochs =
    sumBy(bids, "deploymentDurationInEpochs") / bids.length
  const averageAPR =
    ((totalTributeValue / lockedAtomTotalGlobal / atomPrice) * 12) /
      averageBidDurationInEpochs || 0

  const averageAprFromNumia = metricsGlobal.currentTributeApr

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
      value={averageAprFromNumia.toLocaleString("en-US", {
        style: "percent",
      })}
    />
  )
}
