"use client"

import { Icon } from "@/components/Icon"
import { Tooltip } from "@/components/Tooltip"
import { averageAPRTooltip } from "@/components/ToolTips"
import { voteThresholdByTrancheId } from "@/config"
import { useBackendData } from "@/contract-apis/useBackendData"
import { StatCard } from "../StatCard"

export function CurrentRoundAprGlobal() {
  const { bidsInfo, currentRoundId, isLoading } = useBackendData()

  const tokenBasedBidsInRoundAboveThreshold = Object.values(bidsInfo).filter(
    (bid) => {
      const voteThreshold =
        voteThresholdByTrancheId[
          bid.trancheId as keyof typeof voteThresholdByTrancheId
        ]

      return (
        bid.roundId === currentRoundId &&
        !bid.points?.length &&
        bid.vote_perc >= voteThreshold
      )
    }
  )

  const totalAverageApr = tokenBasedBidsInRoundAboveThreshold.reduce(
    (sum, bid) => {
      const bidApr = (bid.apr_tribute ?? 0) * (bid.vote_perc ?? 0)
      return sum + bidApr
    },
    0
  )

  return (
    <StatCard
      isLoading={isLoading}
      title={
        <Tooltip tipContents={averageAPRTooltip} className="w-full">
          Average{" "}
          <span className="inline-flex items-center gap-1">
            APR
            <Icon name="circle-info" />
          </span>
        </Tooltip>
      }
      subTitle={`Pilot Round ${currentRoundId + 1}`}
      value={(totalAverageApr || 0).toLocaleString("en-US", {
        style: "percent",
      })}
    />
  )
}
