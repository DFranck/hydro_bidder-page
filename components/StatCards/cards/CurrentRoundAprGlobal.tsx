"use client"

import { Icon } from "@/components/Icon"
import { Tooltip } from "@/components/Tooltip"
import { averageAPRTooltip } from "@/components/ToolTips"
import { useBackendData } from "@/contract-apis/useBackendData"
import sumBy from "lodash/sumBy"
import { StatCard } from "../StatCard"

export function CurrentRoundAprGlobal() {
  const { atomPrice, bidsInfo, currentRoundId, isLoading } = useBackendData()

  const tokenBasedBidsInRound = Object.values(bidsInfo).filter(
    (bid) => bid.roundId === currentRoundId && !bid.points?.length
  )

  const summedTributeOverDuration = sumBy(
    tokenBasedBidsInRound,
    (bid) => bid.tribute_value / bid.duration
  )

  const summedVotingPowerInUsd =
    sumBy(tokenBasedBidsInRound, (bid) => bid.power / 1e6) * atomPrice

  const averageApr = (summedTributeOverDuration / summedVotingPowerInUsd) * 12

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
      value={(averageApr || 0).toLocaleString("en-US", {
        style: "percent",
      })}
    />
  )
}
