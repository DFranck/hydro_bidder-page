"use client"

import { Icon } from "@/components/Icon"
import { Tooltip } from "@/components/Tooltip"
import { timeLeftTooltip } from "@/components/ToolTips"
import { useBackendData } from "@/contract-apis/useBackendData"
import { getTimeUntilDate } from "@/lib/getTimeUntilDate"
import { StatCard } from "../StatCard"

export function TimeLeft() {
  const { currentRoundEndDate, currentRoundId, isLoading } = useBackendData()

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
      subTitle={<>Pilot Round {currentRoundId + 1}</>}
      value={
        currentRoundEndDate ? getTimeUntilDate(currentRoundEndDate) : "0:00"
      }
    />
  )
}
