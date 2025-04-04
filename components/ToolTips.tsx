"use client"

import { AmountAndUnitPair } from "@/components/AmountAndUnitPair"
import { BidTribute } from "@/components/BidTribute"
import { Icon } from "@/components/Icon"
import { StyledText } from "@/components/StyledText"
import { HYDRO_TELEGRAM_URL, voteThresholdByTrancheId } from "@/config"
import {
  AugmentedBidAfterWallet,
  BidMetaDataSlimmed,
} from "@/contract-apis/types"
import { amountToUSDString } from "@/lib/amountToUSDString"
import { formatAmount } from "@/lib/formatAmount"
import { pluralize } from "@/lib/pluralize"
import Link from "next/link"
import { Fragment } from "react"
import { twJoin } from "tailwind-merge"

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

export const bidTableTributeAprTooltip = ({
  bidId,
  hasVotedForThisBid,
  tributeValue,
  isWalletConnected,
  userWillReceiveInUsd,
  userWillReceiveInTokens,
}: {
  bidId: number
  hasVotedForThisBid: boolean
  tributeValue: number
  isWalletConnected: boolean
  userWillReceiveInUsd: number
  userWillReceiveInTokens: {
    denom: string
    valueInTokens: number
  }[]
}) => (
  <div className="flex flex-col gap-3">
    <div className="flex flex-col">
      <StyledText variant="label">Tribute Size</StyledText>
      <BidTribute bidId={bidId} textAlign="left" />
    </div>
    <p>
      The total estimated value of this bid&rsquo;s rewards is currently&nbsp;
      <strong className="text-palette-green">
        {amountToUSDString(tributeValue, {
          appendUsd: false,
          numberOfDecimals: 2,
          removeTrailingZeros: true,
        })}
      </strong>
      .
    </p>
    {isWalletConnected && (
      <StyledText>
        {hasVotedForThisBid
          ? "Because you voted on this bid, your share of the rewards would be worth an estimated "
          : "If you vote on this bid, your share of the rewards would be worth an estimated "}
        <StyledText>
          <strong className="text-palette-green">
            {amountToUSDString(userWillReceiveInUsd)}
          </strong>
          :&nbsp;
        </StyledText>
        {userWillReceiveInTokens.map((x, index) => (
          <StyledText key={`${x.denom}_${index}`}>
            {formatAmount(x.valueInTokens, 0, 2)}&nbsp;
            <StyledText className="inline-flex items-center gap-1 text-sm opacity-60">
              {x.denom}
              {index < userWillReceiveInTokens.length - 1 ? (
                <>,&nbsp;</>
              ) : (
                <>&nbsp;</>
              )}
            </StyledText>
          </StyledText>
        ))}
      </StyledText>
    )}
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
  bidInfoFromGithub,
  hasVotedThisRound,
  isTokenBased,
}: {
  bid: AugmentedBidAfterWallet
  bidInfoFromGithub: BidMetaDataSlimmed
  hasVotedThisRound: boolean
  isTokenBased: boolean
}) => {
  const { projectName } = bidInfoFromGithub

  const totalTributeValue = isTokenBased
    ? bid.totalTokenBasedTributeValue
    : (bid.points?.[0] ?? 0)

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
          `${formatAmount(totalTributeValue)} ${bid.points?.[1]}`}
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

export const pastBidTributeAprMetricsPageColumnTooltip = (
  <p>
    This is the APR of the tributes distributed to voters for each of the bids,
    at the end of the round.{" "}
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

export const pastBidTributeAprBidsPageColumnTooltip = (
  <p>
    This is the estimated APR based on the tribute submitted for each bid in
    this round. It updates as bidders adjust tributes or more users vote.{" "}
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

export const lockupLimitReachedByNetworkTooltip = (
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
    The total amount of liquidity that has been deployed to bids over time. It
    is the sum of all deployments from pre-hydro to the latest&nbsp;round.
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
    as tribute, you may see multiple rows for the same&nbsp;bid.
  </p>
)

export const rewardsYourTributeTooltip = (
  <p>
    The estimated USD-equivalent value of the tribute you&rsquo;ve received from
    this&nbsp;bid.
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

export const totalRevenueTooltip = (
  <p>
    The sum of all tributes paid by bidders, excluding bids that didn&rsquo;t
    meet the vote&nbsp;threshold.
  </p>
)

export const usdDisclaimerTooltip = (
  <p>
    USD equivalent values are estimates and may not reflect the actual
    current&nbsp;value.
  </p>
)

export const voteThresholdTooltip = ({ trancheId = 0 }) => {
  const voteThreshold =
    voteThresholdByTrancheId[trancheId as keyof typeof voteThresholdByTrancheId]

  return (
    <p>
      Bids below the minimum threshold of{" "}
      <strong>{voteThreshold * 100}% total voting power</strong> will not
      receive liquidity, and will not pay out tribute to users.{" "}
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
}

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

export const yourVotingPowerTooltip = ({
  canVoteInAllTranches,
  canVoteInSomeTranches,
  hasVotedInEveryTrancheThisRound,
  votingPowerTotal,
  hasSpentAnyVotingPowerInAnyTranche,
  isWalletConnected,
  votingPowerByTranche,
}: {
  canVoteInAllTranches: boolean
  canVoteInSomeTranches: boolean
  hasVotedInEveryTrancheThisRound: boolean
  votingPowerTotal: number
  hasSpentAnyVotingPowerInAnyTranche: boolean
  isWalletConnected: boolean
  votingPowerByTranche: {
    [trancheId: string]: {
      name: string
      votingPowerAvailable: number
      votingPowerSpent: number
    }
  }
}) => {
  const trancheMessage = canVoteInAllTranches ? (
    <p>You can vote in each of the current&nbsp;tranches</p>
  ) : canVoteInSomeTranches ? (
    <p>You can still vote in at least one&nbsp;tranche</p>
  ) : hasVotedInEveryTrancheThisRound ? (
    <p>You&rsquo;ve voted in every tranche this round&nbsp;—&nbsp;bravo!</p>
  ) : null

  if (!isWalletConnected) {
    return <div>Please connect your wallet to see your voting power.</div>
  }

  return (
    <div className="flex flex-col gap-2">
      <div
        className={twJoin(
          "grid grid-cols-[1fr_min-content] gap-x-6 gap-y-1",
          "whitespace-nowrap",
        )}
      >
        <StyledText variant="label" className="col-span-2">
          Voting Power Breakdown
        </StyledText>

        <Fragment>
          <strong>Total Voting Power</strong>
          <div className="text-right">
            <strong>{formatAmount(votingPowerTotal, 0, 4)}</strong>
          </div>
        </Fragment>
      </div>

      <div className="flex flex-col gap-2 border-b pb-2">
        {Object.keys(votingPowerByTranche).map((trancheId) => (
          <div key={`tranche_${trancheId}`}>
            <StyledText variant="label">
              {votingPowerByTranche[trancheId].name}
            </StyledText>
            <div className="flex justify-between">
              <div>Spent Voting Power</div>
              <strong>
                {formatAmount(
                  votingPowerByTranche[trancheId].votingPowerSpent,
                  0,
                  4,
                )}
              </strong>
            </div>
            <div className="flex justify-between">
              <div>Available Voting Power</div>
              <strong>
                {formatAmount(
                  votingPowerByTranche[trancheId].votingPowerAvailable,
                  0,
                  4,
                )}
              </strong>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-1">
        {hasSpentAnyVotingPowerInAnyTranche && (
          <p>
            Your spent voting power is tied to one or more active deployments.
          </p>
        )}
        <p>
          <StyledText variant="link" as={Link} href="/lock-atom">
            Create a new lockup
          </StyledText>{" "}
          for more voting power.
        </p>
      </div>

      {trancheMessage !== null && (
        <div
          className={twJoin(
            "-mx-4 -mb-2 px-4 py-2",
            "bg-palette-green text-center font-bold text-palette-text",
          )}
        >
          {trancheMessage}
        </div>
      )}
    </div>
  )
}

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

export const bidDetailsVoteReceivedTooltip = ({
  bidPower = "0",
  totalPower = "0",
  percentage = "0",
}) => (
  <div className="flex max-w-xs flex-col gap-2">
    <div
      className={twJoin(
        "grid grid-cols-[auto_min-content] gap-x-6 gap-y-1",
        "whitespace-nowrap border-b border-white/20 pb-2",
      )}
    >
      {[
        ["Voting Power on this Bid", bidPower],
        ["Total Voting Power", totalPower],
        [
          <strong key="percentage">Share of this Bid</strong>,
          <strong key="percentage-value">{percentage}%</strong>,
        ],
      ].map(([label, value], index) => (
        <Fragment key={index}>
          <div>{label}</div>
          <div className="text-right tabular-nums">{value}</div>
        </Fragment>
      ))}
    </div>
    <p className="text-sm">
      This bid has received <strong>{bidPower}</strong> voting power out of{" "}
      <strong>{totalPower}</strong> total voting power that participated in this
      round, representing <strong>{percentage}%</strong>.
    </p>
  </div>
)

export const globalTotalAtomLockedTooltip = <p>Total ATOM locked in Hydro.</p>

export const metricsPageNoDataTooltip = (
  <p>No data available for this round yet.</p>
)

export const bidDetailsTributesListTooltip = (
  <p>
    Here, you can see all tributes associated with this bid, including the
    contributors, amounts, and token types.
  </p>
)

export const experimentalTableDeploymentAprTooltip = ({
  hasEnded,
  totalAtom,
  totalUsd,
  deploymentLasted,
}: {
  hasEnded: boolean
  totalAtom: number
  totalUsd: number
  deploymentLasted: string
}) => (
  <div className="flex flex-col">
    <StyledText>
      {hasEnded
        ? "At the end of this deployment, it was worth"
        : "This deployment is currently worth"}
      &nbsp;a total amount of {formatAmount(totalAtom, 0, 2)}&nbsp;
      <StyledText variant="footnote">ATOM</StyledText>
    </StyledText>
    <StyledText variant="footnote">
      (
      {amountToUSDString(totalUsd, {
        appendUsd: false,
        numberOfDecimals: 2,
        removeTrailingZeros: true,
      })}
      )&nbsp;
    </StyledText>
    <StyledText>and has lasted for {deploymentLasted}</StyledText>
  </div>
)
