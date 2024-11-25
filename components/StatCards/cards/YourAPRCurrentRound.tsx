"use client"

import { Tooltip } from "@/components/Tooltip"
import { useContractContext } from "@/contract-apis/useContractContext"
import { StatCard } from "../StatCard"

export function YourAPRCurrentRound() {
  const { currentRoundMetadata: roundMetadata } = useContractContext()
  const { roundId: currentRoundId } = roundMetadata

  return (
    <StatCard
      title={
        <div className="flex items-center gap-1">
          Your Round APR
          <Tooltip
            tipContents={
              <>
                This is your estimated personal APR for the current round based
                on your voting power and the bids for which you&apos;ve voted.
              </>
            }
          />
        </div>
      }
      subTitle={`Pilot Round ${currentRoundId + 1}`}
      value="–%"
    />
  )
}
