"use client"

import { Tooltip } from "@/components/Tooltip"
import { StatCard } from "../StatCard"

export function YourTotalRewardsValue() {
  return (
    <StatCard
      title={
        <div className="flex items-center gap-1">
          Total Rewards Value
          <Tooltip
            tipContents={
              <>
                This is the total value of rewards you have accumulated in the
                current round.
              </>
            }
          />
        </div>
      }
      subTitle="All Time"
      value="$–"
    />
  )
}
