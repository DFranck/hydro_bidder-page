"use client"

import { Icon } from "@/components/Icon"
import { Tooltip } from "@/components/Tooltip"
import { totalRevenueTooltip } from "@/components/ToolTips"
import { useBackendData } from "@/contract-apis/useBackendData"
import sumBy from "lodash/sumBy"
import { StatCard } from "../StatCard"

export function AllTimeRevenue() {
  const { isLoading, bidsInfo } = useBackendData()
  const totalTributePaidUsd = sumBy(Object.values(bidsInfo), (bid) =>
    bid.status !== "Rejected" ? bid.totalTokenBasedTributeValue : 0,
  )

  return (
    <StatCard
      isLoading={isLoading}
      title={
        <Tooltip tipContents={totalRevenueTooltip} className="w-full">
          Distributed{" "}
          <span className="inline-flex items-center gap-1">
            <span>Rewards</span>
            <Icon name="circle-info" />
          </span>
        </Tooltip>
      }
      subTitle="All Time"
      value={`$${Math.round(totalTributePaidUsd).toLocaleString()}`}
    />
  )
}
