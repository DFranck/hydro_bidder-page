"use client"

import { Icon } from "@/components/Icon"
import { Tooltip } from "@/components/Tooltip"
import { StatCard } from "../StatCard"
import { polRevenueTooltip } from "@/components/ToolTips"

export function PoLRevenue() {
  return (
    <StatCard
      title={
        <Tooltip tipContents={polRevenueTooltip}>
          <div className="flex items-center gap-1">
            <span>PoL Revenue</span>
            <Icon name="circle-info" />
          </div>
        </Tooltip>
      }
      subTitle="All Time"
      value="$–"
    />
  )
}
