"use client"
import { Icon } from "@/components/Icon"
import { StyledText } from "@/components/StyledText"
import { Tooltip } from "@/components/Tooltip"
import {
  estimatedRewardsTooltip,
  pointSystemTooltip,
} from "@/components/ToolTips"
import { FullyAugmentedBid } from "@/contract-apis/fetchBackendDataWithWallet"
import { useBackendData } from "@/contract-apis/useBackendData"
import { amountToUSDString } from "@/lib/amountToUSDString"
import { sumBy } from "lodash"
import { ReactNode } from "react"
import { twMerge } from "tailwind-merge"

export function BidRewards({
  bid,
  tooltipContent,
}: {
  bid: FullyAugmentedBid
  tooltipContent?: ReactNode
}) {
  const backendData = useBackendData()
  const { bidDescriptionsByBidId, isWalletConnected, votes } = backendData
  const totalEstimatedRewardsUsd = amountToUSDString(
    sumBy(bid.tributes, "valueInUsd")
  )
  const hasDelta =
    bid.usersEstimatedRewardsDeltaPercentage !== null &&
    bid.usersEstimatedRewardsDeltaPercentage !== 0
  const isPositive = hasDelta && bid.usersEstimatedRewardsDeltaPercentage > 0
  const isTokenBasedBid = bid.tributes.every((tribute) => tribute.isTokenBased)
  const bidDescription = bidDescriptionsByBidId[bid.id] ?? {}

  return (
    <Tooltip
      tipContents={
        tooltipContent ??
        (isTokenBasedBid
          ? estimatedRewardsTooltip({
              bid,
              backendData,
            })
          : pointSystemTooltip({
              learnMoreURL: bidDescription.pointProgramUrl,
            }))
      }
    >
      {!isWalletConnected || votes.length === 0 ? (
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
                {Math.round(bid.usersEstimatedRewardsDeltaPercentage * 100)}%
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
