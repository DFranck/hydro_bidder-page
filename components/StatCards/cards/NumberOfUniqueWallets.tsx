"use client"

import { Tooltip } from "@/components/Tooltip"
import { StatCard } from "../StatCard"

export function NumberOfUniqueWallets() {
  return (
    <StatCard
      title={
        <div className="flex items-center gap-1">
          Number of Unique Wallets
          <Tooltip tipContents={<>...</>} />
        </div>
      }
      subTitle="All Time"
      value="–"
    />
  )
}
