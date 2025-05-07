"use client"

import { Icon } from "@/components/Icon"
import { Tooltip } from "@/components/Tooltip"
import { averageAtomLockedPerWalletTooltip } from "@/components/ToolTips"
import { useBackendData } from "@/contract-apis/useBackendData"
import { StatCard } from "../StatCard"

export function AllTimeAverageAtomLockedPerWallet() {
  const { isLoading, metricsGlobal } = useBackendData()
  const { allTimeUsersAvgTokensLocked } = metricsGlobal

  return (
    <StatCard
      isLoading={isLoading}
      title={
        <Tooltip
          tipContents={averageAtomLockedPerWalletTooltip}
          className="w-full"
        >
          Average ATOM Locked Per{" "}
          <span className="inline-flex items-center gap-1">
            Wallet
            <Icon name="circle-info" />
          </span>
        </Tooltip>
      }
      subTitle="All Time"
      value={allTimeUsersAvgTokensLocked.toFixed(1)}
    />
  )
}
