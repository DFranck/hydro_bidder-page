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

export const baseBidTypeTooltip = ({
  isTokenBasedBid,
  isPlural,
}: {
  isTokenBasedBid: boolean
  isPlural?: boolean
}) => (
  <>
    Bids are submitted by projects.{" "}
    {isTokenBasedBid ? (
      <>
        {isPlural ? "These bids use" : "This bid uses"} live tokens as their
        tribute.
      </>
    ) : (
      <>
        {isPlural ? "These bids use" : "This bid uses"} points as their tribute
        because they do not yet have a live token.
      </>
    )}{" "}
    You can only vote once (per bucket per tranche) but you can switch your vote
    as many times as you want.
  </>
)

export const bidTypeColumnTooltip = ({
  isTokenBasedBid,
}: {
  isTokenBasedBid: boolean
}) => baseBidTypeTooltip({ isTokenBasedBid, isPlural: true })

export const bidTypeTooltip = ({
  isTokenBasedBid,
}: {
  isTokenBasedBid: boolean
}) => baseBidTypeTooltip({ isTokenBasedBid, isPlural: false })

export const currentVoteShareTooltip = (
  <>
    This is the percentage of votes that this project has received so far. It
    may increase or decrease if other users decide to switch their votes before
    the round ends
  </>
)

export const estimatedRewardsColumnTooltip = ({
  hasVotedThisRound,
  isTokenBasedBid,
}: {
  hasVotedThisRound: boolean
  isTokenBasedBid: boolean
}) => {
  const universalPointSystemMessage = (
    <>
      This is the total points offered by this project as a tribute to users.
      The tribute is split amongst the users that vote for this project, based
      on their individual voting power.
    </>
  )
  const messageIfHasVotedThisRound = isTokenBasedBid ? (
    <>
      This is the expected USD-equivalent value of rewards you would receive
      from the bid&rsquo;s tribute. Over time, the value may increase if the
      project adds tributes or decrease if more voters choose the project.
    </>
  ) : (
    universalPointSystemMessage
  )
  const messageIfHasNotVotedThisRound = isTokenBasedBid ? (
    <>
      This is the total estimated USD-equivalent value of the tribute offered by
      the project. The tribute is split amongst the users that vote for the
      project, based on their individual voting power.
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
  isTokenBasedBid,
}: {
  bid: AugmentedBid
  bidDescription: BidDescription
  hasVotedThisRound: boolean
  isTokenBasedBid: boolean
}) => {
  const { projectName } = bidDescription
  const totalTributeValue = isTokenBasedBid
    ? (sumBy(bid.tributes, "valueInUsd") ?? 0)
    : (sumBy(bid.tributes, "amount") ?? 0)
  const percentageOfTotalTributeValue =
    totalTributeValue > 0
      ? Math.round(((bid.usersEstimatedRewards ?? 0) / totalTributeValue) * 100)
      : 0
  const formattedTotalTribute = (
    <strong className="text-palette-beige">
      {isTokenBasedBid
        ? // $1,234 USD
          amountToUSDString(totalTributeValue)
        : // 1,234 POINTS
          `${formatAmount(totalTributeValue)} ${bid.tributes[0].denom}`}
    </strong>
  )
  const rewardDescription = isTokenBasedBid
    ? "estimated USD-equivalent value of rewards"
    : "amount of points"
  const messageIfHasVotedThisRound = (
    <>
      This is the {rewardDescription} you would receive from{" "}
      <strong>{projectName}</strong>. It represents{" "}
      <strong>{percentageOfTotalTributeValue}%</strong> of the total tribute{" "}
      <strong className="text-palette-beige">{formattedTotalTribute}</strong>.
      Over time, the value may increase if the project adds tributes or decrease
      if more voters choose the project.
    </>
  )
  const messageIfHasNotVotedThisRound = (
    <>
      This is the {rewardDescription} offered by <strong>{projectName}</strong>{" "}
      as a tribute. By voting for it, you would receive a portion of this value,
      relative to your voting power, and the voting power of the bid at the end
      of the round.
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

export const extendLockupsToVoteTooltip = (
  <>
    You can extend your lockups to vote for this project.{" "}
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
  <>Longer durations will be available after the pilot rounds</>
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
    The total amount of ATOM allocated to this project as Protocol-Owned
    Liquidity (PoL) during the specified round.
  </>
)

export const metricsStatusColumnTooltip = (
  <>
    The current status of the liquidity deployment, such as &lsquo;Voting Period&rsquo; for current round bids,
    &lsquo;Ongoing&rsquo; for active deployments, or &lsquo;Completed&rsquo; for
    completed ones.
  </>
)

export const metricsTributeColumnTooltip = (
  <>
    The amount offered by the project as tribute to incentivize Hydro voters to
    allocate liquidity to their bid. Tribute was not offered Pre-Hydro.{" "}
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

export const needsWalletConnectionTooltip = (
  <>Connect your wallet to access this feature</>
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
    This represents the total number of individual wallets participating in
    Hydro right now. Each wallet is counted once.
  </>
)

export const pointSystemTooltip = ({
  learnMoreURL,
}: {
  learnMoreURL?: string
}) => (
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

export const polAvailableTooltip = (
  <>
    This is the total ATOM available for Protocol-Owned Liquidity (PoL) to be
    deployed across projects from the Hydro Committee.
  </>
)

export const polDeployedTooltip = (
  <>
    This is the total amount of Protocol-Owned Liquidity (PoL) that has been deployed to
    projects over time. It is the aggregate amount of all past-round
    and Pre-Hydro deployments.
  </>
)

export const polDurationTooltip = (
  <>
    This represents the length of time the project will receive liquidity from
    Hydro. You can only vote for bids with a PoL Duration that matches or is
    shorter than your longest lockup period.{" "}
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
    This represents the total revenue generated from deployed Protocol-Owned
    Liquidity (PoL) for the Cosmos Hub and Hydro, including rewards and tributes
    from funded projects.
  </>
)

export const rewardsPolRewardsColumnTooltip = (
  <>
    This number is your share of the PoL rewards generated by this PoL
    deployment.
  </>
)

export const rewardsYourTributeColumnTooltip = (
  <>
    This is the tribute you earned from this bid in this round. Rewards are
    distributed based on your voting power and the tributes offered by the bid
    you supported.
  </>
)

export const rewardsTotalTributeColumnTooltip = (
  <>
    This is the total tribute that was offered for this bid in the round
    displayed.
  </>
)

export const rewardsYourTributeTooltip = (
  <>
    This is the estimated USD-equivalent value of the rewards you&rsquo;ve
    received from this tribute.
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

export const yourAggregateAprTooltip = (
  <>
    This is your historical APR based on past rounds. It reflects your average
    performance over time.
  </>
)

export const yourRoundAprTooltip = (
  <>
    This is your estimated personal APR for the current round based on your
    voting power and the bids for which you&rsquo;ve voted.
  </>
)

export const yourTotalAtomLockedTooltip = (
  <>
    Your staked ATOM locked in Hydro. The more ATOMs you lock, the higher your
    voting power will be
  </>
)

export const yourTotalRewardsAllTimeTooltip = (
  <>
    Based on today&rsquo;s prices, this is the expected aggregate USD-equivalent
    value of all the rewards you have accumulated across the Hydro rounds you
    have participated in.
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
    The total amount of ATOM allocated to this project as Protocol-Owned
    Liquidity (PoL) during the specified round.
  </>
)

export const bidDetailsStatusTooltip = (
  <>
    The current status of the liquidity deployment, such as &lsquo;Voting Period&rsquo; for current round bids,
    &lsquo;Ongoing&rsquo; for active deployments, or &lsquo;Completed&rsquo; for
    completed ones.
  </>
)

export const globalTotalAtomLockedTooltip = <>Total ATOM locked in Hydro.</>
