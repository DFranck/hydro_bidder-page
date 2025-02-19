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
    bidsById,
    currentRoundId,
    isLoading,
    lockedAtomTotalGlobal,
    metricsGlobal,
  } = useBackendData()
  const bidsInRound = Object.values(bidsById).filter(
    (bid) => bid.roundId === currentRoundId
  )
  const totalTributeValue = sumBy(
    bidsInRound.map((bid) => bid.tributes).flat(),
    "valueUsd"
  )
  const averageBidDurationInEpochs =
    sumBy(bidsInRound, "deploymentDurationInEpochs") / bidsInRound.length
  // TODO: Calculate this properly, then use it
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
