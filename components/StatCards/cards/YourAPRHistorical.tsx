"use client"

import { Icon } from "@/components/Icon"
import { Tooltip } from "@/components/Tooltip"
import { yourAggregateAPRTooltip } from "@/components/ToolTips"
import { StatCard } from "../StatCard"

export function YourAPRHistorical() {
  return (
    <StatCard
      title={
        <Tooltip tipContents={yourAggregateAPRTooltip}>
          <div className="flex items-center gap-1">
            <span>Your Aggregate APR</span>
            <Icon name="circle-info" />
          </div>
        </Tooltip>
      }
      subTitle="No historical data yet"
      value="–%"
    />
  )
}
