"use client"

import { Icon } from "@/components/Icon"
import { StyledText } from "@/components/StyledText"
import { Tooltip } from "@/components/Tooltip"
import {
  estimatedRewardsTooltip,
  pointBasedTributeAmountTooltip,
} from "@/components/ToolTips"
import { useBackendData } from "@/contract-apis/useBackendData"
import { amountToUSDString } from "@/lib/amountToUSDString"
import { simplifyBigNumbers } from "@/lib/simplifyBigNumbers"
import startCase from "lodash/startCase"
import sumBy from "lodash/sumBy"
import { twMerge } from "tailwind-merge"

export function BidRewards({ bidId }: { bidId: number }) {
  const backendData = useBackendData()
  const { bidDescriptionsByBidId, bidsById, currentRoundId, votesByRoundId } =
    backendData
  const bid = bidsById[bidId]

  if (!bid) return null

  const isTokenBased = bid.tributes.every((tribute) => tribute.isTokenBased)
  const totalEstimatedRewardsUsd = amountToUSDString(
    sumBy(bid.tributes, "valueUsd"),
    {
      appendUsd: false,
      numberOfDecimals: 2,
      removeTrailingZeros: true,
    }
  )
  const roundedDeltaPercentage = Math.round(
    bid.usersEstimatedRewardRelativeToCurrentPick
  )
  const hasDelta = roundedDeltaPercentage > 0 || roundedDeltaPercentage < 0
  const votesThisRound = votesByRoundId[currentRoundId] ?? []
  const hasVotedThisRound = votesThisRound.length > 0
  const isPositive = roundedDeltaPercentage > 0
  const bidDescriptionFromGithub = bidDescriptionsByBidId[bidId] ?? {}
  const computedTooltipContent = estimatedRewardsTooltip({
    bid,
    bidDescriptionFromGithub,
    hasVotedThisRound,
    isTokenBased,
  })

  return !isTokenBased ? (
    <Tooltip
      tipContents={pointBasedTributeAmountTooltip({
        pointProgramUrl: bidDescriptionFromGithub.pointProgramUrl,
      })}
    >
      {bid.tributes.map((tribute) => (
        <div key={tribute.denom} className="flex flex-col items-end">
          <div className="flex items-center gap-1">
            {!tribute.isTokenBased && <Icon name="solid:gem" />}
            <span>{simplifyBigNumbers(tribute.amount)}</span>
          </div>
          <StyledText
            variant="footnote"
            as="div"
            className="flex items-center gap-1"
          >
            <span>{startCase(tribute.denom)}</span>
            <Icon name="circle-info" />
          </StyledText>
        </div>
      ))}
    </Tooltip>
  ) : (
    <Tooltip tipContents={computedTooltipContent}>
      {votesThisRound.length === 0 ? (
        <div className="flex items-center gap-1">
          <span>{totalEstimatedRewardsUsd}</span>
          <Icon name="circle-info" />
        </div>
      ) : (
        <div className="flex flex-col">
          <div className="flex items-center justify-end gap-1">
            {hasDelta && (
              <span
                className={twMerge(
                  "flex items-center gap-1 text-xs",
                  isPositive ? "text-palette-green" : "text-palette-red"
                )}
              >
                <Icon
                  name={isPositive ? "solid:arrow-up" : "solid:arrow-down"}
                />
                {roundedDeltaPercentage > 1000 ? (
                  <>&gt;&nbsp;1,000</>
                ) : (
                  roundedDeltaPercentage
                )}
                %
              </span>
            )}
            {amountToUSDString(bid.usersEstimatedRewards, {
              appendUsd: false,
              numberOfDecimals: 2,
              removeTrailingZeros: true,
            })}
            <Icon name="circle-info" />
          </div>
          <StyledText variant="footnote" as="div" className="whitespace-nowrap">
            of {totalEstimatedRewardsUsd}
          </StyledText>
        </div>
      )}
    </Tooltip>
  )
}
