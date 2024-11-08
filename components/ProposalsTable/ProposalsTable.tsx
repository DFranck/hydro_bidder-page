"use client"

import { useAppContext } from "@/app/(with-context)/context"
import { classNames } from "@/app/(with-context)/voting/classNames"
import { Card } from "@/components/Card"
import { Icon } from "@/components/Icon"
import { ModalWindow } from "@/components/ModalWindow"
import { PrettyTable, TD, TR } from "@/components/PrettyTable"
import { StyledText } from "@/components/StyledText"
import { Tooltip } from "@/components/Tooltip"
import { VoteButton } from "@/components/VoteButton"
import { WelcomePopup } from "@/components/WelcomePopup"
import { useUserVotingData } from "@/hooks/hooks"
import { amountToUSDString } from "@/lib/amountToUSDString"
import { useDecoratedProposals } from "@/lib/useDecoratedProposals"
import { estimatedRewardForPower } from "@/lib/utils"
import { useChain } from "@cosmos-kit/react"
import { sum } from "lodash"
import Image from "next/image"
import Link from "next/link"
import { Fragment } from "react"
import { twMerge } from "tailwind-merge"
import { proposalTotalTribute } from "./proposalTotalTribute"

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

export function ProposalsTable() {
  const { globalState } = useAppContext()
  const {
    totalLockedTokens,
    constants: { max_locked_tokens },
  } = globalState
  const { isWalletConnected, address } = useChain("neutron")
  const { data: myUserVotingData, isPending: myUserVotingDataIsPending } =
    useUserVotingData(address ?? "")
  const decoratedProposals = useDecoratedProposals({
    trancheId: 1,
  })
  const hasVoted = decoratedProposals?.some(
    (proposal) => proposal.hasVotedOnProp
  )
  const votingPower = myUserVotingData?.votingPower ?? 0
  const showWelcomeModal =
    (totalLockedTokens / (max_locked_tokens ?? 1)) * 100 < 99 &&
    !myUserVotingDataIsPending &&
    votingPower <= 0
  const percentageOfNonVoters =
    100 -
    sum(decoratedProposals?.map((proposal) => Number(proposal.percentage)))

  return (
    <div className={classNames.container}>
      <ModalWindow isOpen={true} onClose={() => {}}>
        <Card>
          <Card.Header>Pilot Round 1 Lock Cap Reached</Card.Header>
          <Card.Body>
            <div className="prose prose-invert">
              <p>
                The maximum amount of ATOM that can be locked in this round has
                been reached. But things are far from over!
              </p>
              <p>
                Keep optimizing your votes to ensure they go to the most
                rewarding projects. Remember, projects may increase their
                tribute to attract more votes before the round ends, so check
                back often.
              </p>
              <p>Don&rsquo;t miss out on the next phase:</p>
              <ul>
                <li>
                  <strong>Have a lockup?</strong> Continue optimizing your
                  strategy and join our{" "}
                  <StyledText
                    variant="link"
                    as={Link}
                    href="https://t.me/+xUzNOTZjUNw5Mzhk"
                    target="_blank"
                  >
                    Telegram Group
                    <Icon name="solid:arrow-up-right" />
                  </StyledText>{" "}
                  to stay updated.
                </li>
                <li>
                  <strong>No lockup yet?</strong> Join the{" "}
                  <StyledText
                    variant="link"
                    as={Link}
                    href="https://t.me/+xUzNOTZjUNw5Mzhk"
                    target="_blank"
                  >
                    Telegram Group
                    <Icon name="solid:arrow-up-right" />
                  </StyledText>{" "}
                  to be the first to know when Pilot Round 2 kicks off!
                </li>
              </ul>
            </div>
          </Card.Body>
        </Card>
      </ModalWindow>

      <WelcomePopup showModal={showWelcomeModal} />

      {decoratedProposals?.length ? (
        <PrettyTable
          initialSortedColumnKey="yourEstimatedReward"
          contentForFirstRow={
            !!percentageOfNonVoters && (
              <tr>
                <td colSpan={99}>
                  <div className={classNames.percentageOfNonVoters}>
                    <Icon name="solid:ghost" />
                    <Tooltip
                      tipContents={
                        <span>
                          <strong>{percentageOfNonVoters}%</strong> of total
                          voting power has not been allocated to project bids
                          yet.{" "}
                          <a
                            href="/docs/users/voting-for-projects"
                            target="_blank"
                            className="inline-flex items-center gap-1 text-palette-green underline"
                          >
                            Learn more
                            <Icon name="solid:arrow-up-right" />
                          </a>
                        </span>
                      }
                    >
                      <span>
                        <strong>{percentageOfNonVoters}%</strong> have not voted
                        yet
                      </span>
                    </Tooltip>
                  </div>
                </td>
              </tr>
            )
          }
          columns={[
            {
              key: "name",
              label: (
                <div className="flex items-center gap-1">
                  Project Bid
                  <Tooltip
                    tipContents={
                      <>
                        Bids are submitted by projects. You can only vote once
                        (per bucket per tranche) but you can switch your vote as
                        many times as you want
                      </>
                    }
                  />
                </div>
              ),
              isSortable: true,
              propsForCells: {
                className: classNames.classNamesForCells,
              },
              customValueGetter: (row) => row._proposal.title,
            },
            {
              key: "yourEstimatedReward",
              label: (
                <div className="flex items-center gap-1">
                  {isWalletConnected ? "Your" : "Total"} Est. Reward
                  <Tooltip
                    tipContents={
                      <>
                        This is the tribute value that will be paid out to you
                        when the round ends if you vote for this project. It may
                        increase (if the project adds to the tribute) or
                        decrease (if more voters choose this project){" "}
                        <span className="whitespace-nowrap">over time.</span>
                      </>
                    }
                  />
                </div>
              ),
              isSortable: true,
              textAlign: "right",
              initialSortDirection: "DESC",
              propsForCells: {
                className: classNames.classNamesForCells,
              },
              customValueGetter: (row) =>
                estimatedRewardForPower(
                  proposalTotalTribute(row._proposal.pricedAndNamedTributes),
                  votingPower,
                  Number(row._proposal.power ?? 0)
                ),
            },
            {
              key: "currentVoteShare",
              label: (
                <div className="flex items-center gap-1">
                  Vote %
                  <Tooltip
                    classNamesForTooltip="-ml-24"
                    tipContents={
                      <>
                        This is the percentage of votes that this project has
                        received so far. It may increase or decrease if other
                        users decide to switch their votes before the round ends
                      </>
                    }
                  />
                </div>
              ),
              isSortable: true,
              initialSortDirection: "DESC",
              textAlign: "right",
              propsForCells: {
                className: classNames.classNamesForCells,
              },
              customValueGetter: (row) => Number(row._proposal.percentage),
            },
            {
              key: "actions",
              label: "Actions",
              isSortable: false,
              textAlign: "right",
              propsForCells: {
                className: classNames.classNamesForCells,
              },
            },
          ]}
          rows={decoratedProposals.map((proposal, index) => {
            const projectLogo = proposal.projectLogoUrl ? (
              <div className={classNames.projectLogo}>
                <Image
                  className="object-contain"
                  src={proposal.projectLogoUrl}
                  alt={proposal.projectName}
                  fill={true}
                />
              </div>
            ) : null

            const projectTitle = proposal.title.replace(
              /[ ]([^ ]+?)$/gm,
              `${String.fromCharCode(160)}$1`
            )

            const projectLink = `/voting/${proposal.proposal_id}`

            const pointSystemTooltip = (
              <>
                This project is using a point system. Voters get points instead
                of live tokens. In this bid,{" "}
                <var className="font-mono font-bold not-italic text-palette-cyan">
                  {proposal.points?.[0].toLocaleString("en-US")}{" "}
                  {proposal.points?.[1]}
                </var>{" "}
                would be distributed as tribute.{" "}
                {proposal.pointProgramUrl && (
                  <a
                    href={proposal.pointProgramUrl}
                    className="inline-flex items-center gap-1 text-palette-green underline"
                    target="_blank"
                  >
                    Learn More <Icon name="solid:arrow-up-right" />
                  </a>
                )}
              </>
            )

            const voteShareTooltip =
              Number(proposal.percentage) < VOTE_SHARE_THRESHOLD ? (
                <Tooltip
                  tipContents={voteThresholdTooltip}
                  classNamesForTooltip="-ml-24"
                >
                  <Icon
                    name="solid:circle"
                    className="text-xs text-palette-beige"
                  />
                </Tooltip>
              ) : null

            return {
              _proposal: proposal,

              name: (
                <>
                  <div className="flex items-center gap-6">
                    {projectLogo}
                    <p className={classNames.projectTitle}>{projectTitle}</p>
                  </div>
                  <Link href={projectLink} className={classNames.projectLink} />
                </>
              ),

              yourEstimatedReward: proposal.points ? (
                <Tooltip tipContents={pointSystemTooltip}>
                  <Icon name="solid:gem" />
                </Tooltip>
              ) : (
                <Tooltip tipContents={usdDisclaimerTooltip}>
                  {!isWalletConnected ? (
                    amountToUSDString(
                      proposalTotalTribute(proposal.pricedAndNamedTributes)
                    )
                  ) : (
                    <>
                      <div className="flex items-center justify-end gap-2">
                        {proposal.percentDifferenceRewardForUser !== 0 && (
                          <span
                            className={twMerge(
                              `
                                  flex
                                  items-center
                                  gap-1
                                  text-xs
                                `,
                              proposal.percentDifferenceRewardForUser &&
                                proposal.percentDifferenceRewardForUser > 0
                                ? "text-palette-green"
                                : "text-palette-red"
                            )}
                          >
                            <Icon
                              name={
                                proposal?.percentDifferenceRewardForUser &&
                                proposal.percentDifferenceRewardForUser > 0
                                  ? "solid:arrow-up"
                                  : "solid:arrow-down"
                              }
                            />
                            {proposal.percentDifferenceRewardForUser}%
                          </span>
                        )}
                        {hasVoted
                          ? amountToUSDString(
                              proposal.estimatedRewardForUser ?? 0
                            )
                          : "???"}
                      </div>
                      <div className="whitespace-nowrap text-xs opacity-60">
                        of {amountToUSDString(proposal.totalTributeValue)}
                      </div>
                    </>
                  )}
                </Tooltip>
              ),

              currentVoteShare: (
                <div className="flex flex-row-reverse items-center gap-1">
                  {proposal.percentage}%{voteShareTooltip}
                </div>
              ),

              actions: <VoteButton proposal={proposal} size="small" />,
            }
          })}
          renderRow={({
            children,
            row,
            rowIndex,
            rowProps,
            sortedColumnKey,
            sortDirection,
            sortedRows,
          }) => {
            const previousRow = sortedRows?.[
              rowIndex - 1
            ] as (typeof sortedRows)[number]
            const nextRow = sortedRows?.[
              rowIndex + 1
            ] as (typeof sortedRows)[number]

            const shouldShowVoteThresholdLine =
              sortedColumnKey === "currentVoteShare" &&
              previousRow &&
              Number(previousRow._proposal.percentage) >=
                VOTE_SHARE_THRESHOLD &&
              Number(row._proposal.percentage) < VOTE_SHARE_THRESHOLD

            const shouldShowRewardThresholdLine =
              sortedColumnKey === "yourEstimatedReward" &&
              sortDirection === "DESC" &&
              previousRow &&
              nextRow &&
              row._proposal.hasVotedOnProp

            return (
              <Fragment key={row._proposal.proposal_id}>
                {!!shouldShowVoteThresholdLine && (
                  <TR className="js-vote-threshold-line">
                    <TD colSpan={99} className="!p-0">
                      <div
                        className="
                          flex
                          items-center
                          justify-between
                          gap-3
                          whitespace-nowrap
                          text-xs
                          text-palette-beige
                        "
                      >
                        <div
                          className="
                            w-full
                            border-t-2
                            border-palette-beige
                          "
                        />

                        <div className="flex items-center gap-1">
                          <Icon name="solid:circle" />
                          <span>
                            These bids are below the{" "}
                            <strong>
                              {VOTE_SHARE_THRESHOLD}% vote share threshold
                            </strong>
                          </span>
                          <Tooltip tipContents={voteThresholdTooltip} />
                        </div>

                        <div
                          className="
                            w-full
                            border-t-2
                            border-palette-beige
                          "
                        />
                      </div>
                    </TD>
                  </TR>
                )}
                <TR
                  className={
                    row._proposal.hasVotedOnProp
                      ? classNames.hasVotedRow
                      : undefined
                  }
                  key={row._proposal.proposal_id}
                  {...rowProps}
                >
                  {children}
                </TR>
                {!!shouldShowRewardThresholdLine && (
                  <TR
                    className="
                      group-has-[.js-vote-threshold-line]:hidden
                    "
                  >
                    <TD colSpan={99} className="!p-0">
                      <div
                        className="
                          flex
                          items-center
                          justify-between
                          gap-3
                          whitespace-nowrap
                          text-xs
                          text-palette-red
                        "
                      >
                        <div
                          className="
                            w-full
                            border-t-2
                            border-palette-red
                          "
                        />

                        <div className="flex items-center gap-1">
                          <Icon name="solid:arrow-down" />
                          <span>
                            Voting for bids below this line will reduce your
                            estimated rewards
                          </span>
                          {/* <Tooltip tipContents={rewardThresholdTooltip} /> */}
                        </div>

                        <div
                          className="
                            w-full
                            border-t-2
                            border-palette-red
                          "
                        />
                      </div>
                    </TD>
                  </TR>
                )}
              </Fragment>
            )
          }}
        />
      ) : (
        <div className={classNames.noBids}>
          <p>There are no bids available at this moment.</p>
        </div>
      )}
    </div>
  )
}
