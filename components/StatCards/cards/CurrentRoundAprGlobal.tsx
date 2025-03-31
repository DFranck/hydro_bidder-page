"use client"

import { Icon } from "@/components/Icon"
import { Tooltip } from "@/components/Tooltip"
import { averageAPRTooltip } from "@/components/ToolTips"
import { VOTE_SHARE_THRESHOLD } from "@/config"
import { useBackendData } from "@/contract-apis/useBackendData"
import sumBy from "lodash/sumBy"
import { StatCard } from "../StatCard"

export function CurrentRoundAprGlobal() {
  const { atomPrice, bidsInfo, currentRoundId, isLoading } = useBackendData()

  const tokenBasedBidsInRoundAboveThreshold = Object.values(bidsInfo).filter(
    (bid) =>
      bid.roundId === currentRoundId &&
      !bid.points?.length &&
      bid.vote_perc * 100 >= VOTE_SHARE_THRESHOLD
  )

  const summedTributeOverDuration = sumBy(
    tokenBasedBidsInRoundAboveThreshold,
    (bid) => bid.totalTokenBasedTributeValue / bid.duration
  )

  const summedVotingPowerInUsd =
    sumBy(tokenBasedBidsInRoundAboveThreshold, (bid) => bid.power / 1e6) *
    atomPrice

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
