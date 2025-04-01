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
        <Tooltip tipContents={totalRevenueTooltip}>
          <div className="flex items-center gap-1">
            <span>Total Bids</span>
          </div>
        </Tooltip>
      }
      subTitle="All Time"
      value={`${totalBidCount.toLocaleString()}`}
    />
  )
}
