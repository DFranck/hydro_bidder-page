"use client"

import { Icon } from "@/components/Icon"
import { Tooltip } from "@/components/Tooltip"
import { polDeployedTooltip } from "@/components/ToolTips"
import { StatCard } from "../StatCard"

export function PoLDeployed() {
  return (
    <StatCard
      title={
        <Tooltip tipContents={polDeployedTooltip}>
          <div className="flex items-center gap-1">
            <span>PoL Deployed</span>
            <Icon name="circle-info" />
          </div>
        </Tooltip>
      }
      subTitle="All Time"
      value="$–"
    />
  )
}
