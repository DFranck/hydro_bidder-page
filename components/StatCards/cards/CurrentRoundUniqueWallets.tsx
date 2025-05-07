"use client"

import { Icon } from "@/components/Icon"
import { Tooltip } from "@/components/Tooltip"
import { currentRoundUniqueWalletsTooltip } from "@/components/ToolTips"
import { useBackendData } from "@/contract-apis/useBackendData"
import { StatCard } from "../StatCard"

export function CurrentRoundUniqueWallets() {
  const { metricsGlobal } = useBackendData()
  const { allTimeUniqueWallets } = metricsGlobal

  return (
    <StatCard
      title={
        <Tooltip
          tipContents={currentRoundUniqueWalletsTooltip}
          className="w-full"
        >
          Number of Unique{" "}
          <span className="inline-flex items-center gap-1">
            Wallets
            <Icon name="circle-info" />
          </span>
        </Tooltip>
      }
      subTitle="All time"
      value={allTimeUniqueWallets}
    />
  )
}
