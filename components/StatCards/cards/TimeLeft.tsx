"use client"

import { Icon } from "@/components/Icon"
import { Tooltip } from "@/components/Tooltip"
import { timeLeftTooltip } from "@/components/ToolTips"
import { useContractContext } from "@/contract-apis/useContractContext"
import { pluralize } from "@/lib/pluralize"
import { sumBy } from "lodash"
import { StatCard } from "../StatCard"

const getRoundEndTextFromEndDate = (endDate: Date) => {
  const now = new Date()
  const diff = endDate.getTime() - now.getTime()

  const seconds = diff / 1000
  const minutes = seconds / 60
  const hours = minutes / 60
  const days = hours / 24
  const months = days / 30

  let duration = 0,
    unit = ""

  if (Math.abs(months) >= 1) {
    duration = months
    unit = "month"
  } else if (Math.abs(days) >= 1) {
    duration = days
    unit = "day"
  } else if (Math.abs(hours) >= 1) {
    duration = hours
    unit = "hour"
  } else if (Math.abs(minutes) >= 1) {
    duration = minutes
    unit = "minute"
  } else {
    duration = seconds
    unit = "second"
  }

  return pluralize({
    count: Math.floor(duration),
    singular: unit,
    prefixCount: true,
  })
}

export function TimeLeft() {
  const { bidsByRoundId, currentRoundMetadata, isLoading } =
    useContractContext()
  const { roundEnd, roundId } = currentRoundMetadata
  const percentageOfNonVoters =
    100 - sumBy(bidsByRoundId[roundId], "votingPowerPercentage")

  return (
    <StatCard
      isLoading={isLoading}
      title={
        <Tooltip tipContents={timeLeftTooltip}>
          <div className="flex items-center gap-1">
            <span>Time Left</span>
            <Icon name="circle-info" />
          </div>
        </Tooltip>
      }
      subTitle={<>Pilot Round {roundId + 1}</>}
      value={roundEnd ? getRoundEndTextFromEndDate(roundEnd) : "0:00"}
    />
  )
}
