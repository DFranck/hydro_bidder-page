"use client"

import { Icon } from "@/components/Icon"
import { Tooltip } from "@/components/Tooltip"
import { polDeployedTooltip } from "@/components/ToolTips"
import { useBackendData } from "@/contract-apis/useBackendData"
import { StatCard } from "../StatCard"

export function AllTimePoLDeployed() {
  const { isLoading, metricsGlobal } = useBackendData()
  const { allTimePolDeployed } = metricsGlobal

  return (
    <StatCard
      isLoading={isLoading}
      title={
        <Tooltip tipContents={polDeployedTooltip}>
          <div className="flex items-center gap-1">
            <span>PoL Deployed</span>
            <Icon name="circle-info" />
          </div>
        </Tooltip>
      }
      subTitle="All-Time"
      value={Math.round(allTimePolDeployed).toLocaleString()}
    />
  )
}
