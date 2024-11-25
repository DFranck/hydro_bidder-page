"use client"

import { Icon } from "@/components/Icon"
import { StyledText } from "@/components/StyledText"
import { telegramLink } from "@/config"
import { AugmentedBid, RoundMetadata } from "@/contract-apis/useContractContext"
import { amountToUSDString } from "@/lib/amountToUSDString"
import Link from "next/link"

export const VOTE_SHARE_THRESHOLD = 0.05

export const averageAPRTooltip = (
  <div className="flex flex-col gap-2">
    <p>
      This number is the average APR available to Hydro voters during the
      current active round. This is separate and additional to your standard
      staking APR as an ATOM staker.
    </p>

    <StyledText
      variant="link"
      as={Link}
      href="/docs/users/calculating-staking-apr"
      target="_blank"
    >
      <span>Learn More</span>
      <Icon name="solid:arrow-up-right" />
    </StyledText>
  </div>
)

export const averageATOMLockedPerWalletTooltip = <></>

export const averageRoundsPerUserTooltip = <></>

export const bidTypeTooltip = ({
  isTokenBasedBid,
}: {
  isTokenBasedBid: boolean
}) => (
  <>
    Bids are submitted by projects.{" "}
    {isTokenBasedBid ? (
      <>These bids use live tokens as their tribute.</>
    ) : (
      <>
        These bids use points as their tribute because they do not yet have a
        live token.
      </>
    )}{" "}
    You can only vote once (per bucket per tranche) but you can switch your vote
    as many times as you want.
  </>
)

export const currentVoteShareTooltip = (
  <>
    This is the percentage of votes that this project has received so far. It
    may increase or decrease if other users decide to switch their votes before
    the round ends
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

export const lockupLimitReachedByUserTooltip = (
  <>You&rsquo;ve reached the maximum locked tokens</>
)

export const lockupLimitTooltip = (
  <>
    For the pilot round, there is a maximum limit of ATOM you can lockup.{" "}
    <StyledText
      as={Link}
      href="/docs#pilot-rounds"
      className="inline-flex items-center gap-1"
      target="_blank"
      variant="link"
    >
      Learn More
      <Icon name="solid:arrow-up-right" />
    </StyledText>
  </>
)

export const longerLockupsComingSoonTooltip = (
  <>Longer durations will be available after the pilot rounds</>
)

export const metricsStatusColumnTooltip = (
  <>
    The current status of the liquidity deployment, such as
    &lsquo;Ongoing&rsquo; for active deployments or &lsquo;Concluded&rsquo; for
    completed ones.
  </>
)

export const needsWalletConnectionTooltip = (
  <>Connect your wallet to access this feature</>
)

export const networkLimitReachedTooltip = (
  <>
    The cap has been reached for this round. Join the{" "}
    <StyledText
      variant="link"
      as={Link}
      href={telegramLink}
      target="_blank"
      className="inline-flex items-center gap-1"
    >
      <span>Hydro Telegram Group</span>
      <Icon name="solid:arrow-up-right" />
    </StyledText>{" "}
    to get notified when the next round starts.
  </>
)

export const numberOfUniqueWalletsTooltip = <></>

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

export const polAvailableTooltip = <></>

export const polDeployedTooltip = <></>

export const rewardsPolRewardsColumnTooltip = (
  <>
    This number is your share of the PoL rewards generated by this PoL
    deployment.
  </>
)

export const rewardsTributeRewardsColumnTooltip = (
  <>
    This is the estimated USD-equivalent value of the rewards from each tribute
    that you voted for in past rounds.
  </>
)

export const usdDisclaimerTooltip = (
  <>
    USD equivalent values are estimates and may not reflect the actual current
    value.
  </>
)

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

export const yourAggregateAPRTooltip = (
  <>
    This is your historical APR based on past rounds. It reflects your average
    performance over time.
  </>
)

export const yourRoundAPRTooltip = (
  <>
    This is your estimated personal APR for the current round based on your
    voting power and the bids for which you&apos;ve voted.
  </>
)

export const yourTotalATOMLockedTooltip = (
  <>
    Your staked ATOM locked in Hydro. The more ATOMs you lock, the higher your
    voting power will be
  </>
)

export const yourTotalRewardsValueTooltip = (
  <>
    This is the expected aggregate USD-equivalent value of all the rewards you
    have accumulated across the Hydro rounds you have participated in.
  </>
)

export const yourVotingPowerTooltip = (
  <>
    Your Hydro voting power. The more power you have, the larger share of
    tributes you will receive
  </>
)
