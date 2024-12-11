"use client"

import { useBackendData } from "@/contract-apis/useBackendData"
import { formatAmount } from "@/lib/formatAmount"
import { twMerge } from "tailwind-merge"
import { StatCard } from "../StatCard"

export function CurrentRoundAtomLockedGlobal() {
  const {
    isLoading,
    lockedAtomIsAtGlobalCapacity,
    lockedAtomMaxGlobal,
    lockedAtomPercentageGlobal,
    lockedAtomTotalGlobal,
  } = useBackendData()

  return (
    <StatCard
      className={twMerge(
        lockedAtomIsAtGlobalCapacity &&
          `
            bg-gradient-to-t
            from-palette-red/80
            to-palette-red/0
          `
      )}
      isLoading={isLoading}
      value={Math.floor(lockedAtomTotalGlobal / 1e6).toLocaleString()}
      title={<div className="flex items-center gap-1">Total ATOM in Hydro</div>}
      subTitle={
        <>
          <strong>{lockedAtomPercentageGlobal}%</strong> of{" "}
          <strong>{formatAmount(lockedAtomMaxGlobal)}</strong> max
        </>
      }
    />
  )
}
