"use client"

import { Icon } from "@/components/Icon"
import { Tooltip } from "@/components/Tooltip"
import { polRevenueTooltip } from "@/components/ToolTips"
import { useBackendData } from "@/contract-apis/useBackendData"
import { StatCard } from "../StatCard"

export function AllTimePoLRevenue() {
  const { isLoading, metricsGlobal } = useBackendData()
  const { allTimePolRevenue } = metricsGlobal

  return (
    <StatCard
      isLoading={isLoading}
      title={
        <Tooltip tipContents={polRevenueTooltip} className="w-full">
          PoL{" "}
          <span className="inline-flex items-center gap-1">
            Revenue
            <Icon name="circle-info" />
          </span>
        </Tooltip>
      }
      subTitle="All Time"
      value={Math.round(allTimePolRevenue).toLocaleString()}
    />
  )
}
