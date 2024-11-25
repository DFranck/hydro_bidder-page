"use client"

import { Tooltip } from "@/components/Tooltip"
import { StatCard } from "../StatCard"
import { averageRoundsPerUserTooltip } from "@/components/ToolTips"

export function AverageRoundsPerUser() {
  return (
    <StatCard
      title={
        <div className="flex items-center gap-1">
          <span>Average Rounds Per User</span>
          <Tooltip tipContents={averageRoundsPerUserTooltip} />
        </div>
      }
      subTitle="All Time"
      value="–"
    />
  )
}
