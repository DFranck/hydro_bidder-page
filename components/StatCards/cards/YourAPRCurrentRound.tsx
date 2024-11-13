"use client"

import { Tooltip } from "@/components/Tooltip"
import { StatCard } from "../StatCard"

export function YourAPRCurrentRound() {
  return (
    <StatCard
      title={
        <div className="flex items-center gap-1">
          Your APR this Round
          <Tooltip
            tipContents={
              <>
                This is your personal APR for the current round based on your
                voting power and the bids for which you&apos;ve voted.
              </>
            }
          />
        </div>
      }
      subTitle="Pilot Round 1"
      value="–%"
    />
  )
}
