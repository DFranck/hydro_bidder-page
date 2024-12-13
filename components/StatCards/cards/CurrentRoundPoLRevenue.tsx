"use client"

import { Icon } from "@/components/Icon"
import { Tooltip } from "@/components/Tooltip"
import { polRevenueTooltip } from "@/components/ToolTips"
import { useBackendData } from "@/contract-apis/useBackendData"
import { StatCard } from "../StatCard"

export function CurrentRoundPoLRevenue() {
  const { isLoading, metricsGlobal } = useBackendData()
  const { allTimeTributeYield, allTimePolYield } = metricsGlobal
  const currentRoundPoLRevenue = allTimePolYield + allTimeTributeYield

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
      subTitle="Current Round"
      value={Math.round(currentRoundPoLRevenue).toLocaleString()}
    />
  )
}
