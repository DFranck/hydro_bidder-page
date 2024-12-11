"use client"

import { Icon } from "@/components/Icon"
import { Tooltip } from "@/components/Tooltip"
import { polRevenueTooltip } from "@/components/ToolTips"
import { useBackendData } from "@/contract-apis/useBackendData"
import { formatAmount } from "@/lib/formatAmount"
import { StatCard } from "../StatCard"

export function CurrentRoundPoLRevenue() {
  const { isLoading, metricsGlobal } = useBackendData()
  const { currentRoundPolAvailable, currentRoundPolDeployed } = metricsGlobal
  const CurrentRoundPoLRevenue =
    currentRoundPolAvailable - currentRoundPolDeployed

  return (
    <StatCard
      isLoading={isLoading}
      title={
        <Tooltip tipContents={polRevenueTooltip}>
          <div className="flex items-center gap-1">
            <span>PoL Revenue</span>
            <Icon name="circle-info" />
          </div>
        </Tooltip>
      }
      subTitle="All Time"
      value={formatAmount(CurrentRoundPoLRevenue)}
    />
  )
}
