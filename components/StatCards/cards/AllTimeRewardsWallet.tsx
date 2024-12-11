"use client"

import { Icon } from "@/components/Icon"
import { Tooltip } from "@/components/Tooltip"
import { yourTotalRewardsAllTimeTooltip } from "@/components/ToolTips"
import { useBackendData } from "@/contract-apis/useBackendData"
import { formatAmount } from "@/lib/formatAmount"
import { StatCard } from "../StatCard"

export function AllTimeRewardsWallet() {
  const { isLoading, metricsGlobal } = useBackendData()
  const { allTimeUsersRewards } = metricsGlobal

  return (
    <StatCard
      isLoading={isLoading}
      title={
        <Tooltip tipContents={yourTotalRewardsAllTimeTooltip}>
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
