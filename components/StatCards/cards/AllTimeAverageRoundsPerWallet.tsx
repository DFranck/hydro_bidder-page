"use client"

import { Icon } from "@/components/Icon"
import { Tooltip } from "@/components/Tooltip"
import { averageRoundsPerUserTooltip } from "@/components/ToolTips"
import { useBackendData } from "@/contract-apis/useBackendData"
import { StatCard } from "../StatCard"

export function AllTimeAverageRoundsPerWallet() {
  const { isLoading, metricsGlobal } = useBackendData()
  const { allTimeUsersAvgRoundsLocked } = metricsGlobal

  return (
    <StatCard
      isLoading={isLoading}
      title={
        <Tooltip tipContents={averageRoundsPerUserTooltip}>
          <div className="flex items-center gap-1">
            <span>Average Rounds Per User</span>
            <Icon name="circle-info" />
          </div>
        </Tooltip>
      }
      subTitle="All Time"
      value={allTimeUsersAvgRoundsLocked.toFixed(1)}
    />
  )
}
