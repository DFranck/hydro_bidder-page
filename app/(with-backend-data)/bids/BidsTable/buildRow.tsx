import { BidDuration } from "@/components/BidDuration"
import { BidLogoAndTitle } from "@/components/BidLogoAndTitle"
import { BidTributeApr } from "@/components/BidTributeApr"
import { Icon } from "@/components/Icon"
import { InvisibleLink } from "@/components/InvisibleLink"
import { StyledText } from "@/components/StyledText"
import { Tooltip } from "@/components/Tooltip"
import {
  bidLiquidityReceivedTooltip,
  voteThresholdTooltip,
} from "@/components/ToolTips"
import { VoteButton } from "@/components/VoteButton"
import { voteThresholdByTrancheId } from "@/config"
import { BidRevampMetrics } from "@/contract-apis/types"
import { classNames } from "./classNames"
import { twJoin } from "tailwind-merge"
import { ConditionalWrapper } from "@/components/ConditionalWrapper"

export function buildRow({
  bid,
  totalLiquidityForCurrentRound,
  denom,
}: {
  bid: BidRevampMetrics
  totalLiquidityForCurrentRound: number | undefined
  denom: string
}) {
  const bidURL = `/bids/${bid.id}`
  const totalBidLiquidity = totalLiquidityForCurrentRound
    ? totalLiquidityForCurrentRound * bid.vote_perc
    : 0
  const voteThreshold =
    voteThresholdByTrancheId[
      bid.trancheId as keyof typeof voteThresholdByTrancheId
    ]

  return {
    _bid: bid,

    logoAndTitle: (
      <InvisibleLink href={bidURL}>
        <BidLogoAndTitle bidId={bid.id} />
      </InvisibleLink>
    ),

    duration: (
      <InvisibleLink href={bidURL}>
        <BidDuration bidId={bid.id} />
      </InvisibleLink>
    ),

    tributeApr: (
      <InvisibleLink href={bidURL}>
        <BidTributeApr bidId={bid.id} />
      </InvisibleLink>
    ),

    currentVoteShare: (
      <InvisibleLink
        href={bidURL}
        className="flex flex-row-reverse items-center gap-1"
      >
        {bid.vote_perc < voteThreshold ? (
          <Tooltip
            tipContents={voteThresholdTooltip({ trancheId: bid.trancheId })}
            classNamesForTooltip="-ml-24"
          >
            <div className="flex items-center gap-1">
              <StyledText variant="mathSymbol.container">
                <span>{(bid.vote_perc * 100).toFixed(1)}</span>
                <StyledText variant="mathSymbol">%</StyledText>
              </StyledText>
              <Icon name="circle-info" className="text-palette-beige text-xs" />
            </div>
          </Tooltip>
        ) : (
          <ConditionalWrapper
            condition={totalBidLiquidity > 0}
            wrapper={(children) => (
              <Tooltip
                className={twJoin(
                  "inline-flex items-center gap-1",
                  "border-b-2 border-dotted border-white/50 hover:border-white"
                )}
                tipContents={bidLiquidityReceivedTooltip({
                  votePercentage: bid.vote_perc,
                  totalBidLiquidity,
                  denom,
                })}
                classNamesForTooltip="-ml-24"
              >
                {children}
              </Tooltip>
            )}
          >
            <StyledText variant="mathSymbol.container">
              <span>{Math.round(bid.vote_perc * 100).toFixed(1)}</span>
              <StyledText variant="mathSymbol">%</StyledText>
            </StyledText>
          </ConditionalWrapper>
        )}
      </InvisibleLink>
    ),

    actions: (
      <InvisibleLink href={bidURL}>
        <div className="flex items-center justify-end gap-3">
          <VoteButton bidId={bid.id} size="small" />
          <StyledText variant="link" className={classNames.bidDetailsLink}>
            <span className="sr-only">Bid Details</span>{" "}
            <Icon name="chevron-right" />
          </StyledText>
        </div>
      </InvisibleLink>
    ),
  }
}
