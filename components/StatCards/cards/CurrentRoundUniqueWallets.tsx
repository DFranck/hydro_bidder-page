"use client"

import { Icon } from "@/components/Icon"
import { Tooltip } from "@/components/Tooltip"
import { currentRoundUniqueWalletsTooltip } from "@/components/ToolTips"
import { useBackendData } from "@/contract-apis/useBackendData"
import { StatCard } from "../StatCard"

export function CurrentRoundUniqueWallets() {
  const { metricsGlobal } = useBackendData()
  const { currentRoundUniqueWallets } = metricsGlobal

  return (
    <StatCard
      title={
        <Tooltip tipContents={currentRoundUniqueWalletsTooltip}>
          <div className="flex items-center gap-1">
            <span>Number of Unique Wallets</span>
            <Icon name="circle-info" />
          </div>
        </Tooltip>
      }
      subTitle="Current Round"
      value={currentRoundUniqueWallets}
    />
  )
}
