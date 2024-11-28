"use client"

import { Icon } from "@/components/Icon"
import { Tooltip } from "@/components/Tooltip"
import { averageATOMLockedPerWalletTooltip } from "@/components/ToolTips"
import { useBackendData } from "@/contract-apis/useBackendData"
import { StatCard } from "../StatCard"

export function AverageAtomLockedPerWallet() {
  const { globalMetadata } = useBackendData()
  const { metrics } = globalMetadata
  const { allTimeUsersAvgTokenLocked } = metrics

  return (
    <StatCard
      title={
        <Tooltip tipContents={averageATOMLockedPerWalletTooltip}>
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
