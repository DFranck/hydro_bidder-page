"use client"

import { Icon } from "@/components/Icon"
import { Tooltip } from "@/components/Tooltip"
import { currentRoundNumLiveBidsTooltip } from "@/components/ToolTips"
import { useBackendData } from "@/contract-apis/useBackendData"
import { pluralize } from "@/lib/pluralize"
import { StatCard } from "../StatCard"

export function CurrentRoundNumberOfBids() {
  const { bidsInfo, isLoading, currentRoundId } = useBackendData()
  const bidsInRound = Object.values(bidsInfo).filter(
    (bid) => bid.roundId === currentRoundId
  )
  const numPointBasedBids = bidsInRound.filter(
    (bid) => bid.points && bid.points.length > 0
  ).length

  return (
    <StatCard
      isLoading={isLoading}
      title={
        <Tooltip
          tipContents={currentRoundNumLiveBidsTooltip({
            numPointBasedBids,
            numTokenBasedBids: bidsInRound.length - numPointBasedBids,
          })}
        >
          <div className="flex items-center gap-1">
            <span>
              Live{" "}
              {pluralize({
                count: bidsInRound.length,
                singular: "Bid",
              })}
            </span>
            <Icon name="circle-info" />
          </div>
        </Tooltip>
      }
      subTitle={`Pilot Round ${currentRoundId + 1}`}
      value={bidsInRound.length}
    />
  )
}
