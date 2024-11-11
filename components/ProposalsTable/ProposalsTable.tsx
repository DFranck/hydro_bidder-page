"use client"

import { useAppContext } from "@/app/(with-context)/context"
import { classNames } from "@/app/(with-context)/voting/classNames"
import { Icon } from "@/components/Icon"
import { MaxReachedPopup } from "@/components/MaxReachedPopup"
import { PrettyTable, TD, TR } from "@/components/PrettyTable"
import { Tooltip } from "@/components/Tooltip"
import {
  totalEstimatedRewardTooltip,
  usdDisclaimerTooltip,
  voteThresholdTooltip,
  yourEstimatedRewardTooltip,
} from "@/components/ToolTips"
import { VoteButton } from "@/components/VoteButton"
import { WelcomePopup } from "@/components/WelcomePopup"
import { useUserVotingData } from "@/hooks/hooks"
import { amountToUSDString } from "@/lib/amountToUSDString"
import { useDecoratedProposals } from "@/lib/useDecoratedProposals"
import { useChain } from "@cosmos-kit/react"
import { sum } from "lodash"
import Image from "next/image"
import Link from "next/link"
import { Fragment } from "react"
import { twMerge } from "tailwind-merge"

export const VOTE_SHARE_THRESHOLD = 5

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
    Math.round((totalLockedTokens / (max_locked_tokens ?? 1)) * 100) < 100 &&
    !myUserVotingDataIsPending &&
    votingPower <= 0
  const percentageOfNonVoters =
    100 -
    sum(decoratedProposals?.map((proposal) => Number(proposal.percentage)))

  return (
    <div className={classNames.container}>
      <MaxReachedPopup />

      <WelcomePopup showModal={false} />

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
                      isWalletConnected
                        ? yourEstimatedRewardTooltip
                        : totalEstimatedRewardTooltip
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
                !!row._proposal.points
                  ? -1
                  : hasVoted
                    ? (row._proposal.estimatedRewardForUser ?? 0)
                    : (row._proposal.totalTributeValue ?? 0),
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
                <Tooltip
                  tipContents={
                    !isWalletConnected
                      ? totalEstimatedRewardTooltip
                      : usdDisclaimerTooltip
                  }
                >
                  {!isWalletConnected ? (
                    amountToUSDString(proposal.totalTributeValue)
                  ) : (
                    <>
                      <div className="flex items-center justify-end gap-2">
                        {hasVoted &&
                          proposal.percentDifferenceRewardForUser !== 0 && (
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
                        {amountToUSDString(
                          proposal.estimatedRewardForUser ?? 0
                        )}
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
