"use client"

import { Tooltip } from "@/components/Tooltip"
import { StatCard } from "../StatCard"

export function PoLDeployed() {
  return (
    <StatCard
      title={
        <div className="flex items-center gap-1">
          PoL Deployed
          <Tooltip tipContents={<>-</>} />
        </div>
      }
      subTitle="All Time"
      value="$–"
    />
  )
}
