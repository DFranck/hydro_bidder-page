"use client"

import { AmountAndUnitPair } from "@/components/AmountAndUnitPair"
import { BidTribute } from "@/components/BidTribute"
import { Icon } from "@/components/Icon"
import { StyledText } from "@/components/StyledText"
import { HYDRO_TELEGRAM_URL } from "@/config"
import {
  AugmentedBidAfterWallet,
  BidDescriptionFromGithub,
} from "@/contract-apis/types"
import { amountToUSDString } from "@/lib/amountToUSDString"
import { formatAmount } from "@/lib/formatAmount"
import { pluralize } from "@/lib/pluralize"
import sumBy from "lodash/sumBy"
import Link from "next/link"

export const VOTE_SHARE_THRESHOLD = 5

export const averageAPRTooltip = (
  <div className="flex flex-col gap-2">
    <p>
      The average APR available to Hydro voters during the current active round.
      Hydro APR is separate and additional to your staking APR as an ATOM
      staker.{" "}
      <StyledText
        variant="link"
        as={Link}
        href="/docs/users/calculating-staking-apr"
        target="_blank"
      >
        <span>Learn More</span>
        <Icon name="solid:arrow-up-right" />
      </StyledText>
    </p>
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

export const bidPolAprTooltip = ({
  isPendingOrVotingOrOngoing,
  currentAllocationAmount,
  initialAllocationAmount,
}: {
  isPendingOrVotingOrOngoing: boolean
  currentAllocationAmount: number
  initialAllocationAmount: number
}) => (
  <>
    {isPendingOrVotingOrOngoing ? (
      <>
        This deployment is still active or has not been withdrawn. PoL APR will
        be updated once the deployment is fully concluded.
      </>
    ) : (
      <div className="flex flex-col">
        <StyledText variant="label">PoL Rewards</StyledText>
        {currentAllocationAmount && initialAllocationAmount ? (
          <AmountAndUnitPair
            amount={(
              currentAllocationAmount - initialAllocationAmount
            ).toLocaleString(undefined, {
              maximumFractionDigits: 4,
            })}
            unit="ATOM"
            textAlign="left"
          />
        ) : (
          0
        )}
      </div>
    )}
  </>
)

export const bidTablesFirstColumnTooltips = {
  bidsTable: {
    tokenBased: (
      <p>
        These bids use a token as their tribute to incentivize Hydro voters to
        vote for them.
      </p>
    ),
    pointBased: (
      <p>
        These bids use a point system as their tribute to incentivize Hydro
        voters to vote for them.
      </p>
    ),
  },
  metricsTable: {
    tokenBased: <p>These bids used a live token as tribute for their bid.</p>,
    pointBased: (
      <p>These bids used a points system as tribute for their bid.</p>
    ),
  },
}

export const bidTableTributeAprTooltip = ({ bidId }: { bidId: number }) => (
  <div className="flex flex-col gap-3">
    <div className="flex flex-col">
      <StyledText variant="label">Tribute Size</StyledText>
      <BidTribute bidId={bidId} textAlign="left" />
    </div>

    <p>APR is estimated and based on the range of voting power in the round.</p>
  </div>
)

export const tokenBasedTributeAmountTooltip = (
  <p>
    This bid used a token as their tribute to incentivize Hydro voters to vote
    for them.
  </p>
)

export const pointBasedTributeAmountTooltip = ({
  pointProgramUrl,
}: {
  pointProgramUrl?: string
}) =>
  pointProgramUrl && (
    <p>
      The amount offered as tribute by this bid to incentivize Hydro voters to
      allocate liquidity to it. This bid uses points as its tribute because it
      does not yet have a live token.{" "}
      <StyledText
        as={Link}
        href={pointProgramUrl}
        variant="link"
        className="inline-flex items-center gap-1"
      >
        Learn More <Icon name="solid:arrow-up-right" />
      </StyledText>
    </p>
  )

export const currentRoundNumLiveBidsTooltip = ({
  numPointBasedBids,
  numTokenBasedBids,
}: {
  numPointBasedBids: number
  numTokenBasedBids: number
}) => (
  <div className="flex flex-col items-center justify-center">
    <div>
      There {numTokenBasedBids === 1 ? "is" : "are"}{" "}
      <strong>{numTokenBasedBids}</strong> token-based{" "}
      {pluralize({ count: numTokenBasedBids, singular: "bid" })} and{" "}
      <strong>{numPointBasedBids}</strong> point-based{" "}
      {pluralize({ count: numPointBasedBids, singular: "bid" })}.{" "}
      <StyledText
        variant="link"
        as={Link}
        href="/docs/users/voting-for-projects#tribute"
        target="_blank"
      >
        Learn More
      </StyledText>
    </div>
  </div>
)

export const currentVoteShareTooltip = (
  <p>
    The percentage of votes that this bid has received so far. It may change if
    other users decide to switch their vote before the round ends.
  </p>
)

export const cannotContinueLockupTooltip = (
  <p>
    This lockup is larger than the remaining capacity. You may either revert it
    to get back your staked ATOM, or wait and continue when there is capacity.
  </p>
)

export const estimatedRewardsColumnTooltip = ({
  hasVotedThisRound,
  isTokenBased,
}: {
  hasVotedThisRound: boolean
  isTokenBased: boolean
}) => {
  const universalPointSystemMessage = (
    <p>
      The total points offered by this bid as tribute to users. The tribute is
      split by the users that vote for this bid, based on their individual
      voting power.
    </p>
  )
  const messageIfHasVotedThisRound = isTokenBased ? (
    <p>
      The expected USD-equivalent value of tribute you would receive from the
      bid&rsquo;s tribute. Over time, the value may increase if the bidder adds
      tributes or decrease if more voters choose the bid.
    </p>
  ) : (
    universalPointSystemMessage
  )
  const messageIfHasNotVotedThisRound = isTokenBased ? (
    <p>
      The total estimated USD-equivalent value of the tribute offered in this
      bid. The tribute is split amongst the users that vote for the bid, based
      on their individual voting power.
    </p>
  ) : (
    universalPointSystemMessage
  )

  return hasVotedThisRound
    ? messageIfHasVotedThisRound
    : messageIfHasNotVotedThisRound
}

export const estimatedRewardsTooltip = ({
  bid,
  bidDescriptionFromGithub,
  hasVotedThisRound,
  isTokenBased,
}: {
  bid: AugmentedBidAfterWallet
  bidDescriptionFromGithub: BidDescriptionFromGithub
  hasVotedThisRound: boolean
  isTokenBased: boolean
}) => {
  const { projectName } = bidDescriptionFromGithub

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
    <p>
      The {rewardDescription} you would receive from{" "}
      <strong>{projectName}</strong>. It represents{" "}
      <strong>{percentageOfTotalTributeValue}%</strong> of the total tribute{" "}
      <strong className="text-palette-beige">{formattedTotalTribute}</strong>.
      Over time, the value may increase if the bidder adds tribute or decrease
      if more voters choose the bid.
    </p>
  )
  const messageIfHasNotVotedThisRound = (
    <p>
      The {rewardDescription} offered by <strong>{projectName}</strong> as
      tribute. If you vote for this bid and it passes minimum thresholds, you
      will receive a portion of this value relative to your voting power.
    </p>
  )

  return hasVotedThisRound
    ? messageIfHasVotedThisRound
    : messageIfHasNotVotedThisRound
}

export const lockupLimitReachedByUserTooltip = (
  <p>You&rsquo;ve reached the maximum locked tokens for this round.</p>
)

export const lockupLimitTooltip = (
  <p>
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
  </p>
)

export const lockupsTableVotingAndMultiplierColumnTooltip = (
  <p>
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
  </p>
)

export const lockupsTableTimeLeftColumnTooltip = (
  <p>
    Voting power decays over time as the lockup period gets closer to
    expiration. You can edit a lockup at any time to extend the time left,
    reclaiming the max voting power for each lockup.
  </p>
)

export const lockAtomToVoteTooltip = (
  <p>
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
  </p>
)

export const extendLockupsToVoteTooltip = (
  <p>
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
  </p>
)

export const longerLockupsComingSoonTooltip = (
  <p>Longer durations will be available after the pilot rounds.</p>
)

export const metricsPolAprColumnTooltip = (
  <p>
    The Annual Percentage Rate (APR) representing the yield generated by this
    PoL deployment over its duration.
  </p>
)

export const metricsDurationColumnTooltip = (
  <p>The duration for which this PoL has been (or was) deployed.</p>
)

export const metricsPolRewardsColumnTooltip = (
  <p>
    The rewards generated from this PoL deployment, including returns on
    liquidity and any additional benefits distributed to the Cosmos Hub
    Community Pool.
  </p>
)

export const metricsPolSizeColumnTooltip = (
  <p>
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
  </p>
)

export const metricsStatusColumnTooltip = (
  <p>
    The current status of the liquidity deployment, such as &lsquo;Voting
    Period&rsquo;, &lsquo;Ongoing&rsquo; for active deployments,
    &lsquo;Completed&rsquo;, or &lsquo;Rejected&rsquo; for bids that did not
    meet minimum thresholds.
  </p>
)

export const metricsTributeColumnTooltip = (
  <p>
    Estimated annual yield from tributes in this round. Calculated as tribute
    divided by locked voting power, multiplied by 12. Updates as bidders adjust
    tributes or more users vote.{" "}
    <StyledText
      as={Link}
      href="docs/users/voting-for-projects#tribute"
      variant="link"
      className="inline-flex items-center gap-1"
      target="_blank"
    >
      Learn more.
      <Icon name="solid:arrow-up-right" />
    </StyledText>
  </p>
)

export const liveBidTributeAprColumnTooltip = (
  <p>
    Estimated annual yield from tributes in the current round. Calculated as
    tribute divided by locked voting power, multiplied by 12. Updates as bidders
    adjust tributes or more users vote.{" "}
    <StyledText
      as={Link}
      href="docs/users/voting-for-projects#tribute"
      variant="link"
      className="relative z-10 inline-flex items-center gap-1"
      target="_blank"
    >
      Learn more.
      <Icon name="solid:arrow-up-right" />
    </StyledText>
  </p>
)

export const pastBidTributeAprColumnTooltip = (
  <p>
    Final annual yield from tributes in a past round. Calculated as tribute
    divided by locked voting power, multiplied by 12. Use it to compare trends
    in bidding incentives.{" "}
    <StyledText
      as={Link}
      href="docs/users/voting-for-projects#tribute"
      variant="link"
      className="relative z-10 inline-flex items-center gap-1"
      target="_blank"
    >
      Learn more.
      <Icon name="solid:arrow-up-right" />
    </StyledText>
  </p>
)

export const needsWalletConnectionTooltip = (
  <p>Connect your wallet to access this feature.</p>
)

export const networkLimitReachedTooltip = (
  <p>
    Lockup caps have been reached. Join the{" "}
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
    to get notified if caps increase.
  </p>
)

export const currentRoundUniqueWalletsTooltip = (
  <p>
    The total number of individual wallets that have participated in Hydro. Each
    wallet is counted once.
  </p>
)

export const polAvailableTooltip = (
  <p>
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
  </p>
)

export const polDeployedTooltip = (
  <p>
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
  </p>
)

export const polDurationTooltip = (
  <p>
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
  </p>
)

export const polRevenueTooltip = (
  <p>
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
  </p>
)

export const rewardsPolRewardsColumnTooltip = (
  <p>
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
  </p>
)

export const rewardsYourTributeColumnTooltip = (
  <p>
    The tribute you earned from this bid in this round, based on your voting
    power. If a bidder added additional tributes in a round to a bid, or used
    multiple tokens as tribute, you may see multiple rows for the same bid.
  </p>
)

export const rewardsTotalTributeColumnTooltip = (
  <p>
    The tribute that was offered for this bid in the round displayed. If a
    bidder added additional tribute in a round to a bid, or used multiple tokens
    as tribute, you may see multiple rows for the same bid.
  </p>
)

export const rewardsYourTributeTooltip = (
  <p>
    The estimated USD-equivalent value of the tribute you&rsquo;ve received from
    this bid.
  </p>
)

export const timeLeftTooltip = (
  <p>
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
  </p>
)

export const usdDisclaimerTooltip = (
  <p>
    USD equivalent values are estimates and may not reflect the actual current
    value.
  </p>
)

export const voteThresholdTooltip = (
  <p>
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
  </p>
)

export const yourAggregateAprTooltip = (
  <p>
    The Aggregate historical APR for all past rounds, based on total votes and
    total tribute paid out to users.
  </p>
)

export const yourRoundAprTooltip = (
  <p>
    The Average APR for the previous round, based on total votes and total
    tribute paid out to users.
  </p>
)

export const yourTotalAtomLockedTooltip = (
  <p>
    Your staked ATOM locked in Hydro. The more ATOM you lock, the higher your
    voting power will be.
  </p>
)

export const yourTotalRewardsAllTimeTooltip = (
  <p>
    Based on today&rsquo;s prices, the expected aggregate USD-equivalent value
    of tribute you have accumulated across the Hydro rounds you have
    participated in.
  </p>
)

export const yourVotingPowerTooltip = (
  <p>
    Your Hydro voting power. The more power you have, the larger share of
    tributes you will receive
  </p>
)

export const bidDetailsPolSizeTooltip = (
  <p>
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
  </p>
)

export const bidDetailsStatusTooltip = (
  <p>
    The current status of the liquidity deployment, such as &lsquo;Voting
    Period&rsquo;, &lsquo;Ongoing&rsquo; for active deployments,
    &lsquo;Completed&rsquo;, or &lsquo;Rejected&rsquo; for completed ones.
  </p>
)

export const bidDetailsMaxDeploymentAmountTooltip = (
  <p>
    The maximum liquidity this bid can receive is capped by the tribute offered,
    based on Hydro’s tribute floor rule.{" "}
    <StyledText
      variant="link"
      as={Link}
      href="/docs/projects/bidding#minimum-tribute-floor-and-maximum-deployment-amount"
      target="_blank"
    >
      <span>Learn More</span>
      <Icon name="solid:arrow-up-right" />
    </StyledText>
  </p>
)

export const globalTotalAtomLockedTooltip = <p>Total ATOM locked in Hydro.</p>

export const metricsPageNoDataTooltip = (
  <p>No data available for this round yet.</p>
)

export const bidDetailsTributesListTooltip = (
  <p>
    Here, you can see all tributes associated with this bid, including the contributors, amounts, and token types.
  </p>
)
