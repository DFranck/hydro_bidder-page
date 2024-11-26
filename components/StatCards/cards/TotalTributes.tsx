"use client"

import { Icon } from "@/components/Icon"
import { Tooltip } from "@/components/Tooltip"
import { useContractContext } from "@/contract-apis/useContractContext"
import { pluralize } from "@/lib/pluralize"
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
      title={
        <Tooltip
          tipContents={
            <div className="flex flex-col items-center justify-center">
              <div>
                <strong>{numTributes - numPointBasedTributes}</strong>{" "}
                token-based
              </div>
              <div>
                <strong>{numPointBasedTributes}</strong> point-based
              </div>
            </div>
          }
        >
          <div className="flex items-center gap-1">
            <span>
              Live{" "}
              {pluralize({
                count: numTributes,
                singular: "Bid",
              })}
            </span>
            <Icon name="circle-info" />
          </div>
        </Tooltip>
      }
      subTitle={`Pilot Round ${currentRoundId + 1}`}
      value={numTributes}
    />
  )
}
