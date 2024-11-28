"use client"
import { Icon } from "@/components/Icon"
import { StyledText } from "@/components/StyledText"
import { FullyAugmentedBid } from "@/contract-apis/fetchBackendDataWithAddress"
import { amountToUSDString } from "@/lib/amountToUSDString"
import { simplifyBigNumbers } from "@/lib/simplifyBigNumbers"
import { sumBy } from "lodash"

export const PointBasedReward = ({
  bid,
  hasVotedBids,
}: {
  bid: FullyAugmentedBid
  hasVotedBids: boolean
}) => {
  if (hasVotedBids) {
    const totalTributeValue = sumBy(bid.tributes, "valueInUsd")
    const { usersEstimatedRewards } = bid

    return (
      <div className="flex flex-col">
        <div className="flex items-center gap-1">
          <Icon name="circle-info" />
          <span>{amountToUSDString(Math.round(usersEstimatedRewards), 0)}</span>
        </div>
        <StyledText variant="footnote">
          of {amountToUSDString(Math.round(totalTributeValue), 0)}
        </StyledText>
      </div>
    )
  }

  return bid.tributes.map((tribute) => (
    <div key={tribute.tributeId} className="flex items-center gap-1">
      <Icon name="solid:gem" />
      <span>
        {simplifyBigNumbers(Number(tribute.amount), 2)}&nbsp;
        {tribute.denom}
      </span>
    </div>
  ))
}
