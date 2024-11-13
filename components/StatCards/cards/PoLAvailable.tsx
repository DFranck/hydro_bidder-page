"use client"

import { Tooltip } from "@/components/Tooltip"
import { StatCard } from "../StatCard"

export function PoLAvailable() {
  return (
    <StatCard
      title={
        <div className="flex items-center gap-1">
          PoL Available
          <Tooltip tipContents={<>-</>} />
        </div>
      }
      subTitle="All Time"
      value="$–"
    />
  )
}
