"use client"

import { Icon } from "@/components/Icon"
import { Tooltip } from "@/components/Tooltip"
import { globalTotalTokenLockedTooltip } from "@/components/ToolTips"
import { useBackendData } from "@/contract-apis/useBackendData"
import { twMerge } from "tailwind-merge"
import { StatCard } from "../StatCard"
import { useGlobalLockupCapacityInfo } from "@/contract-apis/useGlobalLockupCapacityInfo"

export function CurrentRoundTokenLockedGlobal() {
  const { isLoading } = useBackendData()
  const {
    data: {
      lockedTokenTotalGlobal,
      lockedTokenRemainingCapacityGlobal,
      lockedTokenPercentageGlobal,
      lockedTokenIsAtCapacityGlobal,
      lockedTokenMaxGlobal,
    },
  } = useGlobalLockupCapacityInfo()

  return (
    <StatCard
      className={twMerge(
        lockedTokenIsAtCapacityGlobal &&
          `
            bg-linear-to-t
            from-palette-red/80
            to-palette-red/0
          `
      )}
      isLoading={isLoading}
      value={Math.floor(lockedTokenTotalGlobal ?? 0).toLocaleString()}
      title={
        <Tooltip
          className="w-full"
          tipContents={globalTotalTokenLockedTooltip({
            lockedTokenRemainingCapacityGlobal,
          })}
        >
          Total Tokens in{" "}
          <span className="inline-flex items-center gap-1">
            Hydro
            <Icon name="circle-info" />
          </span>
        </Tooltip>
      }
      subTitle={
        <>
          <strong>{lockedTokenPercentageGlobal}%</strong> of{" "}
          <strong>{lockedTokenMaxGlobal.toLocaleString()}</strong> max
        </>
      }
    />
  )
}
