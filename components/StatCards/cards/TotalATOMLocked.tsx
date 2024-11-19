"use client"

import { useAppContext } from "@/app/(with-context)/context"
import { StatCard } from "@/components/StatCards/StatCard"
import { formatAmount } from "@/lib/utils"
import { twMerge } from "tailwind-merge"

export function TotalATOMLocked() {
  const {
    globalState: {
      constants: { max_locked_tokens },
      totalLockedTokens,
    },
  } = useAppContext()
  const [totalLockedATOM, maxLockedATOM] = [
    totalLockedTokens ?? 0,
    max_locked_tokens ?? 0,
  ]
  const percentageLocked = Math.round((totalLockedATOM / maxLockedATOM) * 100)

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
      value={((totalLockedATOM ?? 0) / 1e6).toLocaleString(undefined, {
        maximumFractionDigits: 0,
      })}
      title={<div className="flex items-center gap-1">Total ATOM in Hydro</div>}
      subTitle={
        <>
          <strong>{percentageLocked}%</strong> of{" "}
          <strong>{formatAmount(maxLockedATOM)}</strong> max.
        </>
      }
    />
  )
}
