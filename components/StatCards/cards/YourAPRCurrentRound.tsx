"use client"

import { useAppContext } from "@/app/(with-context)/context"
import { Tooltip } from "@/components/Tooltip"
import { StatCard } from "../StatCard"

export function YourAPRCurrentRound() {
  const {
    globalState: { currentRound },
  } = useAppContext()

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
      subTitle={`Pilot Round ${currentRound + 1}`}
      value="–%"
    />
  )
}
