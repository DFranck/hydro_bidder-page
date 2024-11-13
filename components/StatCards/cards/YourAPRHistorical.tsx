"use client"

import { Tooltip } from "@/components/Tooltip"
import { StatCard } from "../StatCard"

export function YourAPRHistorical() {
  return (
    <StatCard
      title={
        <div className="flex items-center gap-1">
          Your Aggregate APR
          <Tooltip
            tipContents={
              <>
                This is your historical APR based on past rounds. It reflects
                your average performance over time.
              </>
            }
          />
        </div>
      }
      subTitle="No historical data yet"
      value="–%"
    />
  )
}
