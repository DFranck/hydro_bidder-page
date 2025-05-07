"use client"

import { Icon } from "@/components/Icon"
import { Tooltip } from "@/components/Tooltip"
import { polAvailableTooltip } from "@/components/ToolTips"
import { useBackendData } from "@/contract-apis/useBackendData"
import { StatCard } from "../StatCard"

export function CurrentRoundPoLAvailable() {
  const { isLoading, metricsGlobal } = useBackendData()
  const { currentPolAvailable } = metricsGlobal

  return (
    <StatCard
      isLoading={isLoading}
      title={
        <Tooltip tipContents={polAvailableTooltip} className="w-full">
          PoL{" "}
          <span className="inline-flex items-center gap-1">
            Available
            <Icon name="circle-info" />
          </span>
        </Tooltip>
      }
      subTitle="Current Round"
      value={Math.round(currentPolAvailable).toLocaleString()}
    />
  )
}
