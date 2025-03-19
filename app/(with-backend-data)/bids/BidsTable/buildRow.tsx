import { BidDuration } from "@/components/BidDuration"
import { BidLogoAndTitle } from "@/components/BidLogoAndTitle"
import { BidTributeApr } from "@/components/BidTributeApr"
import { ConditionalWrapper } from "@/components/ConditionalWrapper"
import { Icon } from "@/components/Icon"
import { InvisibleLink } from "@/components/InvisibleLink"
import { StyledText } from "@/components/StyledText"
import { Tooltip } from "@/components/Tooltip"
import {
  VOTE_SHARE_THRESHOLD,
  voteThresholdTooltip,
} from "@/components/ToolTips"
import { VoteButton } from "@/components/VoteButton"
import { BidRevampMetrics } from "@/contract-apis/types"
import { classNames } from "./classNames"

export function buildRow({ bid }: { bid: BidRevampMetrics }) {
  const bidURL = `/bids/${bid.id}`

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
        <ConditionalWrapper
          condition={bid.vote_perc < VOTE_SHARE_THRESHOLD}
          wrapper={(children) => (
            <Tooltip
              tipContents={voteThresholdTooltip}
              classNamesForTooltip="-ml-24"
            >
              <div className="flex items-center gap-1">
                {children}
                <Icon
                  name="circle-info"
                  className="text-xs text-palette-beige"
                />
              </div>
            </Tooltip>
          )}
        >
          <StyledText variant="mathSymbol.container">
            <span>{Math.round(bid.vote_perc)}</span>
            <StyledText variant="mathSymbol">%</StyledText>
          </StyledText>
        </ConditionalWrapper>
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
