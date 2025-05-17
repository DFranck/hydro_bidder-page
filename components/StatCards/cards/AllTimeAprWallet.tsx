"use client"

import { Icon } from "@/components/Icon"
import { Tooltip } from "@/components/Tooltip"
import { yourAggregateAprTooltip } from "@/components/ToolTips"
import { useBackendData } from "@/contract-apis/useBackendData"
import { StatCard } from "../StatCard"

export function AllTimeAprWallet() {
  const { isLoading, metricsGlobal } = useBackendData()
  const { allTimeTributeApr } = metricsGlobal

  return (
    <StatCard
      isLoading={isLoading}
      title={
        <Tooltip tipContents={yourAggregateAprTooltip} className="w-full">
          Aggregate{" "}
          <span className="inline-flex items-center gap-1">
            APR
            <Icon name="circle-info" />
          </span>
        </Tooltip>
      }
      subTitle="All-Time"
      value={`${(allTimeTributeApr * 100).toFixed(1)}%`}
    />
  )
}
