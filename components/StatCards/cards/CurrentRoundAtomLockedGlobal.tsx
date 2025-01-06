"use client"

import { twMerge } from "tailwind-merge"
import { StatCard } from "../StatCard"
import { Icon } from "@/components/Icon"
import { Tooltip } from "@/components/Tooltip"
import { globalTotalAtomLockedTooltip } from "@/components/ToolTips"
import {
  fetchGlobalLockupCapacity,
  GlobalLockupCapacityInfo,
} from "@/contract-apis/fetchGlobalLockupCapacity"
import { useEffect, useState } from "react"

export function CurrentRoundAtomLockedGlobal() {
  const [isLoading, setIsLoading] = useState(false)
  const [globalCap, setGlobalCap] = useState<GlobalLockupCapacityInfo | null>(
    null
  )

  // refresh data every 60 seconds
  useEffect(() => {
    const getData = async () => {
      setIsLoading(true)
      const globalLockupCapacityInfo = await fetchGlobalLockupCapacity()
      setGlobalCap(globalLockupCapacityInfo)
      setIsLoading(false)
    }
    getData()

    // Set up interval to refresh data every 60 seconds
    const interval = setInterval(getData, 60000)

    // Clean up interval on unmount
    return () => clearInterval(interval)
  }, [])

  return (
    <StatCard
      className={twMerge(
        globalCap?.lockedAtomIsAtCapacityGlobal &&
          `
            bg-gradient-to-t
            from-palette-red/80
            to-palette-red/0
          `
      )}
      isLoading={isLoading}
      value={Math.floor(globalCap?.lockedAtomTotalGlobal ?? 0).toLocaleString()}
      title={
        <Tooltip
          tipContents={
            <>
              {globalTotalAtomLockedTooltip} Available capacity:{" "}
              {globalCap?.lockedAtomRemainingCapacityGlobal}
            </>
          }
        >
          <div className="flex items-center gap-1">
            Total ATOM in Hydro
            <Icon name="circle-info" />
          </div>
        </Tooltip>
      }
      subTitle={
        <>
          <strong>{globalCap?.lockedAtomPercentageGlobal}%</strong> of{" "}
          <strong>{globalCap?.lockedAtomMaxGlobal.toLocaleString()}</strong> max
        </>
      }
    />
  )
}
