"use client"

import { Icon } from "@/components/Icon"
import { Tooltip } from "@/components/Tooltip"
import { polAvailableTooltip } from "@/components/ToolTips"
import { StatCard } from "../StatCard"

export function PoLAvailable() {
  return (
    <StatCard
      title={
        <Tooltip tipContents={polAvailableTooltip}>
          <div className="flex items-center gap-1">
            <span>PoL Available</span>
            <Icon name="circle-info" />
          </div>
        </Tooltip>
      }
      subTitle="All Time"
      value="$–"
    />
  )
}
