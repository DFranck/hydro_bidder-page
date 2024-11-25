"use client"

import { Icon } from "@/components/Icon"
import { Tooltip } from "@/components/Tooltip"
import { numberOfUniqueWalletsTooltip } from "@/components/ToolTips"
import { StatCard } from "../StatCard"

export function NumberOfUniqueWallets() {
  return (
    <StatCard
      title={
        <Tooltip tipContents={numberOfUniqueWalletsTooltip}>
          <div className="flex items-center gap-1">
            <span>Number of Unique Wallets</span>
            <Icon name="circle-info" />
          </div>
        </Tooltip>
      }
      subTitle="All Time"
      value="–"
    />
  )
}
