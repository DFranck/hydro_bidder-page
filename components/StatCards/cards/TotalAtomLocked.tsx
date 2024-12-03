"use client"

import { useBackendData } from "@/contract-apis/useBackendData"
import { formatAmount } from "@/lib/formatAmount"
import { twMerge } from "tailwind-merge"
import { StatCard } from "../StatCard"

export function TotalAtomLocked() {
  const {
    isLoading,
    totalLockedAtomGlobal,
    maxLockedAtomGlobal,
    metricsGlobal,
  } = useBackendData()
  const { currentRoundTotalAtomLocked } = metricsGlobal
  const percentageLocked = Math.round(
    (currentRoundTotalAtomLocked / maxLockedAtomGlobal) * 100
  )

  return (
    <StatCard
      className={twMerge(
        percentageLocked === 100 &&
          `
            bg-gradient-to-t
            from-palette-red/80
            to-palette-red/0
          `
      )}
      isLoading={isLoading}
      value={((totalLockedAtomGlobal ?? 0) / 1e6).toLocaleString(undefined, {
        maximumFractionDigits: 0,
      })}
      title={<div className="flex items-center gap-1">Total ATOM in Hydro</div>}
      subTitle={
        <>
          <strong>{percentageLocked}%</strong> of{" "}
          <strong>{formatAmount(maxLockedAtomGlobal)}</strong> max.
        </>
      }
    />
  )
}
