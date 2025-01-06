"use client"

import { Icon } from "@/components/Icon"
import { Tooltip } from "@/components/Tooltip"
import { yourRoundAprTooltip } from "@/components/ToolTips"
import { useBackendData } from "@/contract-apis/useBackendData"
import { StatCard } from "../StatCard"

export function CurrentRoundAprWallet() {
  const { isLoading, metricsGlobal } = useBackendData()
  const { currentRoundId } = useBackendData()
  const { currentTributeApr } = metricsGlobal

  return (
    <StatCard
      isLoading={isLoading}
      title={
        <Tooltip tipContents={yourRoundAprTooltip}>
          <div className="flex items-center gap-1">
            <span>Last Round APR</span>
            <Icon name="circle-info" />
          </div>
        </Tooltip>
      }
      subTitle={`Pilot Round ${currentRoundId}`}
      value={`${(currentTributeApr * 100).toFixed(1)}%`}
    />
  )
}
