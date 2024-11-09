import { Icon } from "@/components/Icon"
import { StyledText } from "@/components/StyledText"
import Link from "next/link"

export const VOTE_SHARE_THRESHOLD = 5

export const voteThresholdTooltip = (
  <>
    Bids below the minimum threshold of{" "}
    <strong>{VOTE_SHARE_THRESHOLD}% total voting power</strong> will not receive
    liquidity, and will not pay out rewards to users.{" "}
    <StyledText
      as="a"
      href="/docs#tribute-refunds"
      variant="link"
      target="_blank"
      className="whitespace-nowrap"
    >
      Learn more
      <Icon name="solid:arrow-up-right" />
    </StyledText>
  </>
)

export const usdDisclaimerTooltip = (
  <>
    USD equivalent values are estimates and may not reflect the actual current
    value.
  </>
)

export const totalEstimatedRewardTooltip = (
  <>
    This is the total tribute value this project has included in their proposal.
    It may increase if the project adds to{" "}
    <span className="whitespace-nowrap">their tribute.</span>
  </>
)

export const yourEstimatedRewardTooltip = (
  <>
    This is the tribute value that will be paid out to you when the round ends
    if you vote for this project. It may increase (if the project adds to the
    tribute) or decrease (if more voters choose this project){" "}
    <span className="whitespace-nowrap">over time.</span>
  </>
)

export const networkLimitReachedTooltip = (
  <>
    The cap has been reached for this round. Join the{" "}
    <StyledText
      variant="link"
      as={Link}
      href="https://t.me/+xUzNOTZjUNw5Mzhk"
      target="_blank"
    >
      Hydro Telegram Group
      <Icon name="solid:arrow-up-right" />
    </StyledText>{" "}
    to get notified when the next round starts.
  </>
)
