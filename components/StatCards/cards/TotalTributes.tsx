"use client"

import { useDecoratedProposals } from "@/lib/useDecoratedProposals"
import { StatCard } from "../StatCard"

export function TotalTributes() {
  const decoratedProposals = useDecoratedProposals({
    trancheId: 1,
  })

  const numTributes = decoratedProposals?.length || 0

  const numPointBasedTributes =
    decoratedProposals?.filter((proposal) => !!proposal.points).length || 0

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
