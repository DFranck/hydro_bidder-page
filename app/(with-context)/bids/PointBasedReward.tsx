"use client"
import { Icon } from "@/components/Icon"
import { StyledText } from "@/components/StyledText"
import { AugmentedBid } from "@/contract-apis/useContractContext"
import { amountToUSDString } from "@/lib/amountToUSDString"
import { simplifyBigNumbers } from "@/lib/simplifyBigNumbers"

export const PointBasedReward = ({
  bid,
  hasVotedBids,
}: {
  bid: AugmentedBid
  hasVotedBids: boolean
}) => {
  if (hasVotedBids) {
    return (
      <div className="flex flex-col">
        <div className="flex items-center gap-1">
          <Icon name="circle-info" />
          <span>
            {amountToUSDString(Math.round(bid.estimatedRewardForUser ?? 0), 0)}
          </span>
        </div>
        <StyledText variant="footnote">
          of {amountToUSDString(Math.round(bid.onchainTributeUsdc ?? 0), 0)}
        </StyledText>
      </div>
    )
  }

  return (
    <>
      {bid.offchainTribute.map((tribute) => (
        <div key={tribute.type} className="flex items-center gap-1">
          <Icon name="solid:gem" />
          <span>
            {simplifyBigNumbers(tribute.amount, 2)}&nbsp;
            {tribute.type}
          </span>
        </div>
      ))}
    </>
  )
}
