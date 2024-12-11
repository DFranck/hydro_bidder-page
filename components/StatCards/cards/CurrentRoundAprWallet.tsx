"use client"

import { Icon } from "@/components/Icon"
import { Tooltip } from "@/components/Tooltip"
import { yourRoundAprTooltip } from "@/components/ToolTips"
import { useBackendData } from "@/contract-apis/useBackendData"
import { StatCard } from "../StatCard"

export function CurrentRoundAprWallet() {
  const { isLoading, metricsGlobal } = useBackendData()
  const { currentRoundId } = useBackendData()
  const { currentRoundUsersApr } = metricsGlobal

  return (
    <StatCard
      isLoading={isLoading}
      title={
        <Tooltip tipContents={yourRoundAprTooltip}>
          <div className="flex items-center gap-1">
            <span>Your Round APR</span>
            <Icon name="circle-info" />
          </div>
        </Tooltip>
      }
      subTitle={`Pilot Round ${currentRoundId + 1}`}
      value={`${Math.round(parseFloat(currentRoundUsersApr[0]?.apr || "0") * 100)}%`}
    />
  )
}
