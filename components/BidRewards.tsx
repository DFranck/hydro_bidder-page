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
import { twMerge } from "tailwind-merge"

export function BidRewards({ bidId }: { bidId: number }) {
  const backendData = useBackendData()
  const { bidMetaDataById, bidsInfo, currentRoundId, votesByRoundId } =
    backendData
  const bid = bidsInfo[bidId]

  if (!bid) return null

  const isTokenBased = bid.tribute && bid.tribute.length > 0
  const totalEstimatedRewardsUsd = amountToUSDString(bid.tribute_value, {
    appendUsd: false,
    numberOfDecimals: 2,
    removeTrailingZeros: true,
  })
  const roundedDeltaPercentage = Math.round(
    bid.usersEstimatedRewardRelativeToCurrentPick
  )
  const hasDelta = roundedDeltaPercentage > 0 || roundedDeltaPercentage < 0
  const votesThisRound = votesByRoundId[currentRoundId] ?? []
  const hasVotedThisRound = votesThisRound.length > 0
  const isPositive = roundedDeltaPercentage > 0
  const bidInfoFromGithub = bidMetaDataById[bidId] ?? {}
  const computedTooltipContent = estimatedRewardsTooltip({
    bid,
    bidInfoFromGithub,
    hasVotedThisRound,
    isTokenBased,
  })

  return !isTokenBased ? (
    <Tooltip
      tipContents={pointBasedTributeAmountTooltip({
        pointProgramUrl: bidInfoFromGithub.pointProgramUrl,
      })}
    >
      {bid.tributes.map((tribute) => (
        <div key={tribute.denom} className="flex flex-col items-end">
          <div className="flex items-center gap-1">
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
