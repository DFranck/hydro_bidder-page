"use client"

import { Icon } from "@/components/Icon"
import { Tooltip } from "@/components/Tooltip"
import { polDeployedTooltip } from "@/components/ToolTips"
import { useBackendData } from "@/contract-apis/useBackendData"
import { StatCard } from "../StatCard"

export function AllTimePoLDeployed() {
  const { currentRoundId, isLoading, metricsGlobal } = useBackendData()
  const { allTimePolDeployed } = metricsGlobal

  return (
    <StatCard
      isLoading={isLoading}
      title={
        <Tooltip tipContents={polDeployedTooltip} className="w-full">
          Total{" "}
          <span className="inline-flex items-center gap-1">
            Deployments
            <Icon name="circle-info" />
          </span>
        </Tooltip>
      }
      subTitle="All-Time"
      value={Math.round(allTimePolDeployed).toLocaleString()}
    />
  )
}
