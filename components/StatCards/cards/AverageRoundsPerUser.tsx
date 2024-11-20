"use client"

import { Tooltip } from "@/components/Tooltip"
import { StatCard } from "../StatCard"

export function AverageRoundsPerUser() {
  return (
    <StatCard
      title={
        <div className="flex items-center gap-1">
          Average Rounds Per User
          <Tooltip tipContents={<>...</>} />
        </div>
      }
      subTitle="All Time"
      value="–"
    />
  )
}
