"use client"

import { Icon } from "@/components/Icon"
import { Tooltip } from "@/components/Tooltip"
import { polAvailableTooltip } from "@/components/ToolTips"
import { useBackendData } from "@/contract-apis/useBackendData"
import { StatCard } from "../StatCard"

export function CurrentRoundPoLAvailable() {
  const { isLoading, metricsGlobal } = useBackendData()
  const { currentPolTotal } = metricsGlobal

  return (
    <StatCard
      isLoading={isLoading}
      title={
        <Tooltip tipContents={polAvailableTooltip}>
          <div className="flex items-center gap-1">
            <span>PoL Available</span>
            <Icon name="circle-info" />
          </div>
        </Tooltip>
      }
      subTitle="All-Time"
      value={Math.round(currentPolTotal).toLocaleString()}
    />
  )
}
