"use client"

import { useContractContext } from "@/contract-apis/useContractContext"
import { StatCard } from "../StatCard"

export function TotalTributes() {
  const { bidsByRoundId, currentRoundMetadata: roundMetadata } =
    useContractContext()
  const { roundId: currentRoundId } = roundMetadata

  const numPointBasedTributes =
    bidsByRoundId[currentRoundId]?.filter((bid) => !!bid.offchainTribute.length)
      .length || 0

  const numTributes = bidsByRoundId[currentRoundId]?.length || 0

  return (
    <StatCard
      title="Total Tributes"
      subTitle={
        <div className="flex items-center justify-center gap-2">
          <span>
            <strong>{numPointBasedTributes}</strong> point-based
          </span>
          <span className="opacity-50">|</span>
          <span>
            <strong>{numTributes - numPointBasedTributes}</strong> token-based
          </span>
        </div>
      }
      value={numTributes}
    />
  )
}
