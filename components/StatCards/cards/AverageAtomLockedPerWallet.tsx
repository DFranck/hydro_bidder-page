"use client"

import { Icon } from "@/components/Icon"
import { Tooltip } from "@/components/Tooltip"
import { averageAtomLockedPerWalletTooltip } from "@/components/ToolTips"
import { useBackendData } from "@/contract-apis/useBackendData"
import { StatCard } from "../StatCard"

export function AverageAtomLockedPerWallet() {
  const { isLoading, metricsGlobal } = useBackendData()
  const { allTimeUsersAvgTokenLocked } = metricsGlobal

  return (
    <StatCard
      isLoading={isLoading}
      title={
        <Tooltip tipContents={averageAtomLockedPerWalletTooltip}>
          <div className="flex items-center gap-1">
            <span>Average ATOM Locked Per Wallet</span>
            <Icon name="circle-info" />
          </div>
        </Tooltip>
      }
      subTitle="All Time"
      value={Math.round(allTimeUsersAvgTokenLocked)}
    />
  )
}
