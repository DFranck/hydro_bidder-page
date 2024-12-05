"use client"
import { Icon } from "@/components/Icon"
import { StyledText } from "@/components/StyledText"
import { Tooltip } from "@/components/Tooltip"
import {
  estimatedRewardsTooltip,
  pointSystemTooltip,
} from "@/components/ToolTips"
import { useBackendData } from "@/contract-apis/useBackendData"
import { amountToUSDString } from "@/lib/amountToUSDString"
import { simplifyBigNumbers } from "@/lib/simplifyBigNumbers"
import { startCase, sumBy } from "lodash"
import { twMerge } from "tailwind-merge"

export function BidRewards({ bidId }: { bidId: number }) {
  const backendData = useBackendData()
  const { bidDescriptionsByBidId, isWalletConnected, votes, votingPower } =
    backendData
  const bid = Object.values(backendData.bidsByRoundId)
    .flat()
    .find((bid) => bid.id === bidId)

  if (!bid) {
    throw new Error(`Bid with id ${bidId} not found`)
  }
  const isTokenBasedBid = bid.tributes.every((tribute) => tribute.isTokenBased)
  const totalEstimatedRewardsUsd = amountToUSDString(
    sumBy(bid.tributes, "valueInUsd")
  )
  const hasDelta =
    bid.usersEstimatedRewardsDeltaPercentage !== null &&
    bid.usersEstimatedRewardsDeltaPercentage !== 0
  const isPositive = hasDelta && bid.usersEstimatedRewardsDeltaPercentage > 0
  const bidDescription = bidDescriptionsByBidId[bidId] ?? {}
  const computedTooltipContent = estimatedRewardsTooltip({
    bid,
    bidDescription,
    hasVotingPower: Boolean(votingPower),
    isTokenBasedBid,
  })

  return !isTokenBasedBid ? (
    <Tooltip
      tipContents={pointSystemTooltip({
        learnMoreURL: bidDescription.pointProgramUrl,
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
      {!votes || votes.length === 0 ? (
        <div className="flex items-center gap-1">
          <span>{totalEstimatedRewardsUsd}</span>
          <Icon name="circle-info" />
        </div>
      ) : (
        <div className="flex flex-col">
          <div className="flex items-center justify-end gap-1">
            <Icon name="circle-info" />
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
                {Math.round(bid.usersEstimatedRewardsDeltaPercentage)}%
              </span>
            )}
            {amountToUSDString(bid.usersEstimatedRewards)}
          </div>
          <StyledText variant="footnote" as="div" className="whitespace-nowrap">
            of {totalEstimatedRewardsUsd}
          </StyledText>
        </div>
      )}
    </Tooltip>
  )
}
