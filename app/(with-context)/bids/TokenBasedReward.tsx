"use client"
import { Icon } from "@/components/Icon"
import { StyledText } from "@/components/StyledText"
import { FullyAugmentedBid } from "@/contract-apis/fetchBackendDataWithAddress"
import { amountToUSDString } from "@/lib/amountToUSDString"
import { sumBy } from "lodash"
import { RewardDelta } from "./RewardDelta"

export const TokenBasedReward = ({
  bid,
  isWalletConnected,
}: {
  bid: FullyAugmentedBid
  isWalletConnected: boolean
}) => {
  const tokenBasedTributes = bid.tributes.filter((t) => t.isTokenBased)

  const totalEstimatedRewards = amountToUSDString(
    sumBy(tokenBasedTributes, "valueInUsd")
  )

  if (!isWalletConnected || !bid.usersEstimatedRewards) {
    return totalEstimatedRewards
  }

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-end gap-1">
        <Icon name="circle-info" />
        <RewardDelta
          deltaPercentage={bid.usersEstimatedRewardsDeltaPercentage}
        />
        {amountToUSDString(bid.usersEstimatedRewards)}
      </div>
      <StyledText variant="footnote" as="div" className="whitespace-nowrap">
        of {totalEstimatedRewards}
      </StyledText>
    </div>
  )
}
