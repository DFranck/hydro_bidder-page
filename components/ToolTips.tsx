import { Icon } from "@/components/Icon"
import { StyledText } from "@/components/StyledText"
import { AugmentedBid, RoundMetadata } from "@/contract-apis/useContractContext"
import { amountToUSDString } from "@/lib/amountToUSDString"
import Link from "next/link"

export const VOTE_SHARE_THRESHOLD = 0.05

export const voteThresholdTooltip = (
  <>
    Bids below the minimum threshold of{" "}
    <strong>{VOTE_SHARE_THRESHOLD * 100}% total voting power</strong> will not
    receive liquidity, and will not pay out rewards to users.{" "}
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

export const pointSystemTooltip = ({
  learnMoreURL,
}: { learnMoreURL?: string } = {}) => (
  <>
    This project is using a point system. Voters get points instead of live
    tokens.{" "}
    {learnMoreURL && (
      <a
        href={learnMoreURL}
        className="inline-flex items-center gap-1 text-palette-green underline"
        target="_blank"
      >
        Learn More <Icon name="solid:arrow-up-right" />
      </a>
    )}
  </>
)

export const usdDisclaimerTooltip = (
  <>
    USD equivalent values are estimates and may not reflect the actual current
    value.
  </>
)

export const estimatedRewardsTooltip = ({
  bid,
  roundMetadata,
}: {
  bid?: AugmentedBid
  roundMetadata: RoundMetadata
}) => {
  const percentageOfTribute =
    bid && roundMetadata.usersVotingPower
      ? bid.votingPower / (bid.votingPower + roundMetadata.usersVotingPower)
      : null
  const isTokenBasedTribute = bid ? bid.offchainTribute.length === 0 : null

  return (
    <>
      This is the expected{" "}
      {isTokenBasedTribute
        ? "USD-equivalent value of rewards"
        : "amount of points you will receive based on your voting power"}
      .{" "}
      {percentageOfTribute ? (
        <>
          It represents{" "}
          <strong className="text-palette-beige">
            {Math.round(percentageOfTribute * 100)}%
          </strong>{" "}
          of the{" "}
        </>
      ) : (
        <>Until you have voting power, it is the</>
      )}{" "}
      {bid && isTokenBasedTribute ? (
        <strong className="text-palette-beige">
          {amountToUSDString(bid.onchainTributeUsdc)}
        </strong>
      ) : (
        `total`
      )}{" "}
      tribute provided by the project. Over time, the value may increase if the
      project adds tributes or decrease if more voters choose{" "}
      <span className="whitespace-nowrap">the project.</span>
    </>
  )
}

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
