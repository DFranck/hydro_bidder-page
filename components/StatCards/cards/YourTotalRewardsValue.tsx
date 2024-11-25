"use client"

import { Icon } from "@/components/Icon"
import { Tooltip } from "@/components/Tooltip"
import { yourTotalRewardsValueTooltip } from "@/components/ToolTips"
import { StatCard } from "../StatCard"

export function YourTotalRewardsValue() {
  return (
    <StatCard
      title={
        <Tooltip tipContents={yourTotalRewardsValueTooltip}>
          <div className="flex items-center gap-1">
            <span>Your Rewards</span>
            <Icon name="circle-info" />
          </div>
        </Tooltip>
      }
      subTitle="All-Time"
      value="$–"
    />
  )
}
