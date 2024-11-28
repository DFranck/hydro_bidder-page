"use client"

import { Icon } from "@/components/Icon"
import { Tooltip } from "@/components/Tooltip"
import { yourTotalRewardsValueTooltip } from "@/components/ToolTips"
import { useBackendData } from "@/contract-apis/useBackendData"
import { formatAmount } from "@/lib/utils"
import { StatCard } from "../StatCard"

export function YourTotalRewardsValue() {
  const { isLoading, metricsGlobal } = useBackendData()
  const { allTimeUsersRewards } = metricsGlobal

  return (
    <StatCard
      isLoading={isLoading}
      title={
        <Tooltip tipContents={yourTotalRewardsValueTooltip}>
          <div className="flex items-center gap-1">
            <span>Your Rewards</span>
            <Icon name="circle-info" />
          </div>
        </Tooltip>
      }
      subTitle="All-Time"
      value={formatAmount(allTimeUsersRewards)}
    />
  )
}
