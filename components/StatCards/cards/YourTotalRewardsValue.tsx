"use client"

import { Tooltip } from "@/components/Tooltip"
import { StatCard } from "../StatCard"

export function YourTotalRewardsValue() {
  return (
    <StatCard
      title={
        <div className="flex items-center gap-1">
          Your Rewards
          <Tooltip
            tipContents={
              <>
                This is the expected aggregate USD-equivalent value of all the
                rewards you have accumulated across the Hydro rounds you have
                participated in.
              </>
            }
          />
        </div>
      }
      subTitle="All-Time"
      value="$–"
    />
  )
}
