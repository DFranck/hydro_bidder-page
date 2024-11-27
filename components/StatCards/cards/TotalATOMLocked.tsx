"use client"

import { useBackendData } from "@/contract-apis/useBackendData"
import { formatAmount } from "@/lib/utils"
import { twMerge } from "tailwind-merge"
import { StatCard } from "../StatCard"

export function TotalATOMLocked() {
  const { globalMetadata } = useBackendData()
  const { totalLockedTokens, maxLockedTokens, metrics } = globalMetadata
  const { currentRoundTotalAtomLocked } = metrics
  const percentageLocked = Math.round(
    (currentRoundTotalAtomLocked / maxLockedTokens) * 100
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
      isLoading={typeof totalLockedTokens !== "number"}
      value={((totalLockedTokens ?? 0) / 1e6).toLocaleString(undefined, {
        maximumFractionDigits: 0,
      })}
      title={<div className="flex items-center gap-1">Total ATOM in Hydro</div>}
      subTitle={
        <>
          <strong>{percentageLocked}%</strong> of{" "}
          <strong>{formatAmount(maxLockedTokens)}</strong> max.
        </>
      }
    />
  )
}
