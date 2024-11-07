"use client"

import { useAppContext } from "@/app/(with-context)/context"
import { StatCard } from "@/components/StatCards/StatCard"
import { formatAmount } from "@/lib/utils"

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

  return (
    <StatCard
      isLoading={!totalLockedTokens}
      value={((totalLockedATOM ?? 0) / 1e6).toLocaleString(undefined, {
        maximumFractionDigits: 0,
      })}
      title={<div className="flex items-center gap-1">Total ATOM in Hydro</div>}
      subTitle={
        <>
          <strong>
            {((totalLockedATOM / maxLockedATOM) * 100).toFixed(0)}%
          </strong>{" "}
          of <strong>{formatAmount(maxLockedATOM)}</strong> max.
        </>
      }
    />
  )
}
