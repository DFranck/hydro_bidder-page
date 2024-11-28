"use client"

import { Icon } from "@/components/Icon"
import { Tooltip } from "@/components/Tooltip"
import { polDeployedTooltip } from "@/components/ToolTips"
import { useBackendData } from "@/contract-apis/useBackendData"
import { formatAmount } from "@/lib/utils"
import { StatCard } from "../StatCard"

export function PoLDeployed() {
  const { isLoading, metricsGlobal } = useBackendData()
  const { currentRoundPolDeployed } = metricsGlobal

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
      subTitle="All Time"
      value={formatAmount(currentRoundPolDeployed)}
    />
  )
}
