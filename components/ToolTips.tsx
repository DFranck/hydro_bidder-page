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

export const estimatedRewardsTooltip = (
  <>
    This is the expected USD-equivalent value of rewards. It represents a
    percentage of the total tribute provided by the project. Over time, the
    value may increase if the project adds tributes or decrease if more voters
    choose <span className="whitespace-nowrap">the projec.</span>
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
