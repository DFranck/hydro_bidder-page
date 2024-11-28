"use client"

import { Icon } from "@/components/Icon"
import { Tooltip } from "@/components/Tooltip"
import { yourAggregateAprTooltip } from "@/components/ToolTips"
import { useBackendData } from "@/contract-apis/useBackendData"
import { sumBy } from "lodash"
import { StatCard } from "../StatCard"

export function YourAprHistorical() {
  const { isLoading, metricsGlobal } = useBackendData()
  const { allTimeUsersApr } = metricsGlobal
  const averageApr = sumBy(allTimeUsersApr, "apr") / allTimeUsersApr.length

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
      subTitle="No historical data yet"
      value={`${Math.round(averageApr * 100)}%`}
    />
  )
}
