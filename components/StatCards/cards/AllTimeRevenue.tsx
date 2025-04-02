"use client"

import { Icon } from "@/components/Icon"
import { Tooltip } from "@/components/Tooltip"
import { totalRevenueTooltip } from "@/components/ToolTips"
import { useBackendData } from "@/contract-apis/useBackendData"
import sumBy from "lodash/sumBy"
import { StatCard } from "../StatCard"

export function AllTimeRevenue() {
  const { isLoading, bidsInfo } = useBackendData()
  const totalTributePaidUsd = sumBy(
    Object.values(bidsInfo),
    (bid) => bid.status !== "Rejected" ? bid.totalTokenBasedTributeValue : 0
  )

  return (
    <StatCard
      isLoading={isLoading}
      title={
        <Tooltip tipContents={totalRevenueTooltip}>
          <div className="flex items-center gap-1">
            <span>Total Revenue</span>
            <Icon name="circle-info" />
          </div>
        </Tooltip>
      }
      subTitle="All Time"
      value={`$${Math.round(totalTributePaidUsd).toLocaleString()}`}
    />
  )
}
