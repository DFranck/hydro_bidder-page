"use client"

import { Tooltip } from "@/components/Tooltip"
import { totalRevenueTooltip } from "@/components/ToolTips"
import { useBackendData } from "@/contract-apis/useBackendData"
import { StatCard } from "../StatCard"
import { Icon } from "@/components/Icon"

export function AllTimeBidCount() {
  const { isLoading, bidsInfo } = useBackendData()
  const totalBidCount = Object.values(bidsInfo).length

  return (
    <StatCard
      isLoading={isLoading}
      title={
        <Tooltip tipContents={totalRevenueTooltip} className="w-full">
          Total{" "}
          <span className="inline-flex items-center gap-1">
            Bids
            <Icon name="circle-info" />
          </span>
        </Tooltip>
      }
      subTitle="All Time"
      value={`${totalBidCount.toLocaleString()}`}
    />
  )
}
