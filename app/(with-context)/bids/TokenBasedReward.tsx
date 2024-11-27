"use client"
import { Icon } from "@/components/Icon"
import { StyledText } from "@/components/StyledText"
import { AugmentedBid } from "@/contract-apis/useContractContext"
import { amountToUSDString } from "@/lib/amountToUSDString"
import { RewardDelta } from "./RewardDelta"

export const TokenBasedReward = ({
  bid,
  isWalletConnected,
}: {
  bid: AugmentedBid
  isWalletConnected: boolean
}) => {
  if (!isWalletConnected) {
    return amountToUSDString(Math.round(bid.onchainTributeUsdc ?? 0), 0)
  }

  if (!bid.estimatedRewardForUser) {
    return amountToUSDString(bid.onchainTributeUsdc)
  }

  return (
    <>
      <div className="flex items-center justify-end gap-1">
        <Icon name="circle-info" />
        <RewardDelta deltaPercentage={bid.estimatedRewardDeltaAsPercentage} />
        {amountToUSDString(bid.estimatedRewardForUser)}
      </div>
      <StyledText variant="footnote" as="div" className="whitespace-nowrap">
        of {amountToUSDString(bid.onchainTributeUsdc)}
      </StyledText>
    </>
  )
}
