"use client"

import { Icon } from "@/components/Icon"
import { Tooltip } from "@/components/Tooltip"
import { averageAPRTooltip } from "@/components/ToolTips"
import { useBackendData } from "@/contract-apis/useBackendData"
import sumBy from "lodash/sumBy"
import { StatCard } from "../StatCard"

export function CurrentRoundAprGlobal() {
  const { bidsById, currentRoundId, isLoading } = useBackendData()
  const bidsInRound = Object.values(bidsById).filter(
    (bid) => bid.roundId === currentRoundId
  )
  const totalTributeAprMin = sumBy(bidsInRound, "tributeAprMin")
  const totalTributeAprMax = sumBy(bidsInRound, "tributeAprMax")
  const averageTributeApr =
    (totalTributeAprMin + totalTributeAprMax) / 2 / bidsInRound.length

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
      value={averageTributeApr.toLocaleString("en-US", {
        style: "percent",
      })}
    />
  )
}
