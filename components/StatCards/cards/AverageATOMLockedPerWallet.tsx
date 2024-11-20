"use client"

import { Tooltip } from "@/components/Tooltip"
import { StatCard } from "../StatCard"

export function AverageATOMLockedPerWallet() {
  return (
    <StatCard
      title={
        <div className="flex items-center gap-1">
          Average ATOM Locked Per Wallet
          <Tooltip tipContents={<>...</>} />
        </div>
      }
      subTitle="All Time"
      value="–"
    />
  )
}
