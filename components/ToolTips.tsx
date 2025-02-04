"use client"

import { Icon } from "@/components/Icon"
import { StyledText } from "@/components/StyledText"
import { HYDRO_TELEGRAM_URL } from "@/config"
import { AugmentedBid } from "@/contract-apis/fetchBackendDataAfterWallet"
import { BidDescription } from "@/contract-apis/fetchBidDescriptions"
import { amountToUSDString } from "@/lib/amountToUSDString"
import { formatAmount } from "@/lib/formatAmount"
import { sumBy } from "lodash"
import Link from "next/link"

export const VOTE_SHARE_THRESHOLD = 5

export const averageAPRTooltip = (
  <div className="flex flex-col gap-2">
    <p>
      The average APR available to Hydro voters during the current active round.
      Hydro APR is separate and additional to your staking APR as an ATOM
      staker.
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

export const averageAtomLockedPerWalletTooltip = (
  <>
    The average amount of ATOM that has been locked by each participating wallet
    across all Hydro rounds. This helps illustrate the typical commitment level
    per user.
  </>
)

export const averageRoundsPerUserTooltip = (
  <>
    The average number of Hydro rounds that each wallet has participated in.
    This metric shows how engaged users are over time.
  </>
)

// All copy is put together here
export const getTributeTypeDescription = ({
  isTokenBased,
  isPlural,
}: {
  isTokenBased: boolean
  isPlural?: boolean
}) => {
  const theseBidsOrThisBid = isPlural ? "These bids" : "This bid"
  const useOrUses = isPlural ? "use" : "uses"
  const themOrIt = isPlural ? "them" : "it"

  return (
    <>
      The amount offered as tribute by {theseBidsOrThisBid} to incentivize Hydro
      voters to allocate liquidity to {themOrIt}.{" "}
      {isTokenBased ? (
        <>
          {theseBidsOrThisBid} {useOrUses} live tokens as their tribute.
        </>
      ) : (
        <>
          {theseBidsOrThisBid} {useOrUses} points as their tribute because they
          do not yet have a live token.
        </>
      )}
    </>
  )
}

export const bidTableFirstColumnTooltip = ({
  isTokenBased,
}: {
  isTokenBased: boolean
}) => (
  <div className="flex flex-col gap-2">
    {/* Remove this if you don't want the type description */}
    <p>{getTributeTypeDescription({ isTokenBased, isPlural: true })}</p>

    <p>Custom text for bid table</p>
  </div>
)

export const metricsTableFirstColumnTooltip = ({
  isTokenBased,
}: {
  isTokenBased: boolean
}) => (
  <div className="flex flex-col gap-2">
    {/* Remove this if you don't want the type description */}
    <p>{getTributeTypeDescription({ isTokenBased, isPlural: true })}</p>

    <p>Custom text for metrics table</p>
  </div>
)

export const tributeAmountTooltip = ({
  isTokenBased,
  pointProgramUrl,
}: {
  isTokenBased: boolean
  pointProgramUrl?: string
}) => (
  <div>
    {getTributeTypeDescription({
      isTokenBased,
      isPlural: false,
    })}

    {pointProgramUrl && (
      <StyledText
        as={Link}
        href={pointProgramUrl}
        variant="link"
        className="inline-flex items-center gap-1"
        target="_blank"
      >
        Learn More <Icon name="solid:arrow-up-right" />
      </StyledText>
    )}
  </div>
)

export const currentVoteShareTooltip = (
  <>
    The percentage of votes that this bid has received so far. It may change if
    other users decide to switch their vote before the round ends.
  </>
)

export const cannotContinueLockupTooltip = (
  <>
    This lockup is larger than the remaining capacity. You may either revert it
    to get back your staked ATOM, or wait and continue when there is capacity.
  </>
)

export const estimatedRewardsColumnTooltip = ({
  hasVotedThisRound,
  isTokenBased,
}: {
  hasVotedThisRound: boolean
  isTokenBased: boolean
}) => {
  const universalPointSystemMessage = (
    <>
      The total points offered by this bid as tribute to users. The tribute is
      split by the users that vote for this bid, based on their individual
      voting power.
    </>
  )
  const messageIfHasVotedThisRound = isTokenBased ? (
    <>
      The expected USD-equivalent value of tribute you would receive from the
      bid&rsquo;s tribute. Over time, the value may increase if the bidder adds
      tributes or decrease if more voters choose the bid.
    </>
  ) : (
    universalPointSystemMessage
  )
  const messageIfHasNotVotedThisRound = isTokenBased ? (
    <>
      The total estimated USD-equivalent value of the tribute offered in this
      bid. The tribute is split amongst the users that vote for the bid, based
      on their individual voting power.
    </>
  ) : (
    universalPointSystemMessage
  )

  return hasVotedThisRound
    ? messageIfHasVotedThisRound
    : messageIfHasNotVotedThisRound
}

export const estimatedRewardsTooltip = ({
  bid,
  bidDescription,
  hasVotedThisRound,
  isTokenBased,
}: {
  bid: AugmentedBid
  bidDescription: BidDescription
  hasVotedThisRound: boolean
  isTokenBased: boolean
}) => {
  const { projectName } = bidDescription

  const totalTributeValue = isTokenBased
    ? (sumBy(bid.tributes, "valueUsd") ?? 0)
    : (sumBy(bid.tributes, "amount") ?? 0)

  const percentageOfTotalTributeValue =
    totalTributeValue > 0
      ? Math.round(((bid.usersEstimatedRewards ?? 0) / totalTributeValue) * 100)
      : 0

  const formattedTotalTribute = (
    <strong className="text-palette-beige">
      {isTokenBased
        ? // $1,234 USD
          amountToUSDString(totalTributeValue)
        : // 1,234 POINTS
          `${formatAmount(totalTributeValue)} ${bid.tributes[0].denom}`}
    </strong>
  )

  const rewardDescription = isTokenBased
    ? "estimated USD-equivalent value of rewards"
    : "amount of points"

  const messageIfHasVotedThisRound = (
    <>
      The {rewardDescription} you would receive from{" "}
      <strong>{projectName}</strong>. It represents{" "}
      <strong>{percentageOfTotalTributeValue}%</strong> of the total tribute{" "}
      <strong className="text-palette-beige">{formattedTotalTribute}</strong>.
      Over time, the value may increase if the bidder adds tribute or decrease
      if more voters choose the bid.
    </>
  )
  const messageIfHasNotVotedThisRound = (
    <>
      The {rewardDescription} offered by <strong>{projectName}</strong> as
      tribute. If you vote for this bid and it passes minimum thresholds, you
      will receive a portion of this value relative to your voting power.
    </>
  )

  return hasVotedThisRound
    ? messageIfHasVotedThisRound
    : messageIfHasNotVotedThisRound
}

export const lockupLimitReachedByUserTooltip = (
  <>You&rsquo;ve reached the maximum locked tokens for this round.</>
)

export const lockupLimitTooltip = (
  <>
    During Pilot Rounds, there is a maximum limit of ATOM you can lockup.{" "}
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

export const lockupsTableVotingAndMultiplierColumnTooltip = (
  <>
    Each lockup provides different voting power. The voting power and multiplier
    are determined by the amount of ATOM and duration of each lockup.{" "}
    <StyledText
      as={Link}
      href="/docs/users/locking-lsm-shares#voting-power"
      variant="link"
      className="inline-flex items-center gap-1"
      target="_blank"
    >
      Learn more
      <Icon name="solid:arrow-up-right" />
    </StyledText>
  </>
)

export const lockupsTableTimeLeftColumnTooltip = (
  <>
    Voting power decays over time as the lockup period gets closer to
    expiration. You can edit a lockup at any time to extend the time left,
    reclaiming the max voting power for each lockup.
  </>
)

export const lockAtomToVoteTooltip = (
  <>
    All of your lockups are in use or expired. Lock more ATOM to vote for this
    bid.{" "}
    <StyledText
      as={Link}
      href="/docs/users/voting-for-projects"
      target="_blank"
      variant="link"
      className="inline-flex items-center gap-1"
    >
      <span>Learn More</span>
      <Icon name="arrow-up-right-from-square" />
    </StyledText>
  </>
)

export const extendLockupsToVoteTooltip = (
  <>
    You can extend your lockups to vote for this bid.{" "}
    <StyledText
      as={Link}
      href="/docs/users/voting-for-projects"
      target="_blank"
      variant="link"
      className="inline-flex items-center gap-1"
    >
      <span>Learn More</span>
      <Icon name="arrow-up-right-from-square" />
    </StyledText>
  </>
)

export const longerLockupsComingSoonTooltip = (
  <>Longer durations will be available after the pilot rounds.</>
)

export const metricsPolAprColumnTooltip = (
  <>
    The Annual Percentage Rate (APR) representing the yield generated by this
    PoL deployment over its duration.
  </>
)

export const metricsDurationColumnTooltip = (
  <>The duration for which this PoL has been (or was) deployed.</>
)

export const metricsPolRewardsColumnTooltip = (
  <>
    The rewards generated from this PoL deployment, including returns on
    liquidity and any additional benefits distributed to the Cosmos Hub
    Community Pool.
  </>
)

export const metricsPolSizeColumnTooltip = (
  <>
    The total amount of ATOM allocated to this bid as PoL during the specified
    round.{" "}
    <StyledText
      as={Link}
      href="/docs/users/user-faq#what-is-protocol-owned-liquidity"
      variant="link"
      className="inline-flex items-center gap-1"
      target="_blank"
    >
      What is PoL?
      <Icon name="solid:arrow-up-right" />
    </StyledText>
  </>
)

export const metricsStatusColumnTooltip = (
  <>
    The current status of the liquidity deployment, such as &lsquo;Voting
    Period&rsquo;, &lsquo;Ongoing&rsquo; for active deployments,
    &lsquo;Completed&rsquo;, or &lsquo;Rejected&rsquo; for bids that did not
    meet minimum thresholds.
  </>
)

export const metricsTributeColumnTooltip = (
  <>
    Additional yield from tribute, rewarded by the bidder to voters who
    supported this bid in a Hydro auction. Tribute was not available Pre-Hydro.{" "}
    <StyledText
      as={Link}
      href="/docs/projects/bidding#tribute-additions"
      variant="link"
      className="inline-flex items-center gap-1"
      target="_blank"
    >
      Learn more
      <Icon name="solid:arrow-up-right" />
    </StyledText>
  </>
)

export const metricsTributeAprColumnTooltip = (
  <>
    Additional yield from tribute, rewarded by the bidder to voters who
    supported this bid in a Hydro auction.{" "}
    <StyledText
      as={Link}
      href="/docs/projects/bidding#tribute-additions"
      variant="link"
      className="relative z-10 inline-flex items-center gap-1"
      target="_blank"
    >
      Learn more
      <Icon name="solid:arrow-up-right" />
    </StyledText>
  </>
)

export const needsWalletConnectionTooltip = (
  <>Connect your wallet to access this feature.</>
)

export const networkLimitReachedTooltip = (
  <>
    The cap has been reached for this round. Join the{" "}
    <StyledText
      variant="link"
      as={Link}
      href={HYDRO_TELEGRAM_URL}
      target="_blank"
      className="inline-flex items-center gap-1"
    >
      <span>Hydro Telegram Group</span>
      <Icon name="solid:arrow-up-right" />
    </StyledText>{" "}
    to get notified when the next round starts.
  </>
)

export const currentRoundUniqueWalletsTooltip = (
  <>
    The total number of individual wallets that have participated in Hydro. Each
    wallet is counted once.
  </>
)

export const pointSystemTooltip = ({
  learnMoreURL,
}: {
  learnMoreURL?: string
}) => (
  <>
    This bid is using a point system for tribute. Voters get points instead of
    live tokens.{" "}
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

export const polAvailableTooltip = (
  <>
    The total ATOM available to be deployed across all bids from the Hydro
    Committee as PoL.{" "}
    <StyledText
      as={Link}
      href="/docs/users/user-faq#what-is-protocol-owned-liquidity"
      variant="link"
      className="inline-flex items-center gap-1"
      target="_blank"
    >
      What is PoL?
      <Icon name="solid:arrow-up-right" />
    </StyledText>
  </>
)

export const polDeployedTooltip = (
  <>
    The total amount of PoL that has been deployed to bids over time. It is the
    aggregate amount of all past-round and Pre-Hydro deployments.{" "}
    <StyledText
      as={Link}
      href="/docs/users/user-faq#what-is-protocol-owned-liquidity"
      variant="link"
      className="inline-flex items-center gap-1"
      target="_blank"
    >
      What is PoL?
      <Icon name="solid:arrow-up-right" />
    </StyledText>
  </>
)

export const polDurationTooltip = (
  <>
    The length of time the bid will receive liquidity from Hydro. Users can only
    vote for bids with a PoL Duration that matches or is shorter than your
    longest lockup period.{" "}
    <StyledText
      variant="link"
      as={Link}
      href="docs/users/voting-for-projects#voting-eligibility-based-on-pol-duration"
      target="_blank"
      className="inline-flex items-center gap-1"
    >
      <span>Learn More</span>
      <Icon name="solid:arrow-up-right-from-square" />
    </StyledText>
  </>
)

export const polRevenueTooltip = (
  <>
    The total revenue generated from deployed PoL for the Cosmos Hub and Hydro,
    including rewards and tribute from funded bids.{" "}
    <StyledText
      as={Link}
      href="/docs/users/user-faq#what-is-protocol-owned-liquidity"
      variant="link"
      className="inline-flex items-center gap-1"
      target="_blank"
    >
      What is PoL?
      <Icon name="solid:arrow-up-right" />
    </StyledText>
  </>
)

export const rewardsPolRewardsColumnTooltip = (
  <>
    Your share of the PoL rewards generated by this PoL deployment.{" "}
    <StyledText
      as={Link}
      href="/docs/users/user-faq#what-is-protocol-owned-liquidity"
      variant="link"
      className="inline-flex items-center gap-1"
      target="_blank"
    >
      What is PoL?
      <Icon name="solid:arrow-up-right" />
    </StyledText>
  </>
)

export const rewardsYourTributeColumnTooltip = (
  <>
    The tribute you earned from this bid in this round, based on your voting
    power. If a bidder added additional tributes in a round to a bid, or used
    multiple tokens as tribute, you may see multiple rows for the same bid.
  </>
)

export const rewardsTotalTributeColumnTooltip = (
  <>
    The tribute that was offered for this bid in the round displayed. If a
    bidder added additional tribute in a round to a bid, or used multiple tokens
    as tribute, you may see multiple rows for the same bid.
  </>
)

export const rewardsYourTributeTooltip = (
  <>
    The estimated USD-equivalent value of the tribute you&rsquo;ve received from
    this bid.
  </>
)

export const timeLeftTooltip = (
  <>
    Amount of time until the round ends. Users must vote before the end of the
    round to receive tributes.{" "}
    <StyledText
      as="a"
      href="/docs/users/voting-for-projects"
      variant="link"
      target="_blank"
      className="whitespace-nowrap"
    >
      <span>Learn More</span>
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

export const voteThresholdTooltip = (
  <>
    Bids below the minimum threshold of{" "}
    <strong>{VOTE_SHARE_THRESHOLD}% total voting power</strong> will not receive
    liquidity, and will not pay out tribute to users.{" "}
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

export const yourAggregateAprTooltip = (
  <>
    The Aggregate historical APR for all past rounds, based on total votes and
    total tribute paid out to users.
  </>
)

export const yourRoundAprTooltip = (
  <>
    The Average APR for the previous round, based on total votes and total
    tribute paid out to users.
  </>
)

export const yourTotalAtomLockedTooltip = (
  <>
    Your staked ATOM locked in Hydro. The more ATOM you lock, the higher your
    voting power will be.
  </>
)

export const yourTotalRewardsAllTimeTooltip = (
  <>
    Based on today&rsquo;s prices, the expected aggregate USD-equivalent value
    of tribute you have accumulated across the Hydro rounds you have
    participated in.
  </>
)

export const yourVotingPowerTooltip = (
  <>
    Your Hydro voting power. The more power you have, the larger share of
    tributes you will receive
  </>
)

export const bidDetailsPolSizeTooltip = (
  <>
    The total amount of ATOM allocated to this bid as PoL during the specified
    round.{" "}
    <StyledText
      as={Link}
      href="/docs/users/user-faq#what-is-protocol-owned-liquidity"
      variant="link"
      className="inline-flex items-center gap-1"
      target="_blank"
    >
      What is PoL?
      <Icon name="solid:arrow-up-right" />
    </StyledText>
  </>
)

export const bidDetailsStatusTooltip = (
  <>
    The current status of the liquidity deployment, such as &lsquo;Voting
    Period&rsquo;, &lsquo;Ongoing&rsquo; for active deployments,
    &lsquo;Completed&rsquo;, or &lsquo;Rejected&rsquo; for completed ones.
  </>
)

export const bidDetailsVoteReceivedTooltip = (
  <>
    The percentage of votes that this bid received during the specified round.
  </>
)

export const globalTotalAtomLockedTooltip = <>Total ATOM locked in Hydro.</>
