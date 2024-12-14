"use client"

import { Icon } from "@/components/Icon"
import { Tooltip } from "@/components/Tooltip"
import { yourAggregateAprTooltip } from "@/components/ToolTips"
import { useBackendData } from "@/contract-apis/useBackendData"
import { StatCard } from "../StatCard"

export function AllTimeAprWallet() {
  const { currentRoundId, isLoading, metricsGlobal } = useBackendData()
  const { allTimeTributeApr } = metricsGlobal

  return (
    <StatCard
      isLoading={isLoading}
      title={
        <Tooltip tipContents={yourAggregateAprTooltip}>
          <div className="flex items-center gap-1">
            <span>Your Aggregate APR</span>
            <Icon name="circle-info" />
          </div>
        </Tooltip>
      }
      subTitle="All-Time"
      value={`${(allTimeTributeApr * 100).toFixed(1)}%`}
    />
  )
}
