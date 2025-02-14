"use client"

import { Icon } from "@/components/Icon"
import { Tooltip } from "@/components/Tooltip"
import { currentRoundNumLiveBidsTooltip } from "@/components/ToolTips"
import { useBackendData } from "@/contract-apis/useBackendData"
import { pluralize } from "@/lib/pluralize"
import { StatCard } from "../StatCard"

export function CurrentRoundNumberOfBids() {
  const { bidsByRoundId, isLoading, currentRoundId } = useBackendData()
  const bids = bidsByRoundId[currentRoundId] ?? []
  const numPointBasedBids = bids.filter(
    (bid) => false === bid.tributes.every((t) => t.isTokenBased)
  ).length

  return (
    <StatCard
      isLoading={isLoading}
      title={
        <Tooltip
          tipContents={currentRoundNumLiveBidsTooltip({
            numPointBasedBids,
            numTokenBasedBids: bids.length - numPointBasedBids,
          })}
        >
          <div className="flex items-center gap-1">
            <span>
              Live{" "}
              {pluralize({
                count: bids.length,
                singular: "Bid",
              })}
            </span>
            <Icon name="circle-info" />
          </div>
        </Tooltip>
      }
      subTitle={`Pilot Round ${currentRoundId + 1}`}
      value={bids.length}
    />
  )
}
