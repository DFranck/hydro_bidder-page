"use client"

import { Icon } from "@/components/Icon"
import { Tooltip } from "@/components/Tooltip"
import { globalTotalAtomLockedTooltip } from "@/components/ToolTips"
import { useBackendData } from "@/contract-apis/useBackendData"
import { twMerge } from "tailwind-merge"
import { StatCard } from "../StatCard"
import { useGlobalLockupCapacityInfo } from "@/contract-apis/useGlobalLockupCapacityInfo"

export function CurrentRoundAtomLockedGlobal() {
  const { isLoading } = useBackendData()
  const {
    lockedAtomTotalGlobal,
    lockedAtomRemainingCapacityGlobal,
    lockedAtomPercentageGlobal,
    lockedAtomIsAtCapacityGlobal,
    lockedAtomMaxGlobal,
  } = useGlobalLockupCapacityInfo()

  return (
    <StatCard
      className={twMerge(
        lockedAtomIsAtCapacityGlobal &&
          `
            bg-gradient-to-t
            from-palette-red/80
            to-palette-red/0
          `
      )}
      isLoading={isLoading}
      value={Math.floor(lockedAtomTotalGlobal ?? 0).toLocaleString()}
      title={
        <Tooltip
          className="w-full"
          tipContents={
            <>
              {globalTotalAtomLockedTooltip} Available capacity:{" "}
              {lockedAtomRemainingCapacityGlobal}
            </>
          }
        >
          Total ATOM in{" "}
          <span className="inline-flex items-center gap-1">
            Hydro
            <Icon name="circle-info" />
          </span>
        </Tooltip>
      }
      subTitle={
        <>
          <strong>{lockedAtomPercentageGlobal}%</strong> of{" "}
          <strong>{lockedAtomMaxGlobal.toLocaleString()}</strong> max
        </>
      }
    />
  )
}
