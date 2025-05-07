"use client"

import { Tooltip } from "@/components/Tooltip"
import { totalRevenueTooltip } from "@/components/ToolTips"
import { useBackendData } from "@/contract-apis/useBackendData"
import { StatCard } from "../StatCard"

export function AllTimeBidCount() {
  const { isLoading, bidsInfo } = useBackendData()
  const totalBidCount = Object.values(bidsInfo).length

  return (
    <StatCard
      isLoading={isLoading}
      title={
        <Tooltip tipContents={totalRevenueTooltip} className="w-full">
          Total Bids
        </Tooltip>
      }
      subTitle="All Time"
      value={`${totalBidCount.toLocaleString()}`}
    />
  )
}
