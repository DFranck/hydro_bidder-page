"use client"

import { useAppContext } from "@/app/(with-context)/context"
import { ContentContainer } from "@/components/ContentContainer"
import { Icon } from "@/components/Icon"
import { MaxReachedPopup } from "@/components/MaxReachedPopup"
import { StatCards } from "@/components/StatCards"
import { StyledTable, TD, TR } from "@/components/StyledTable"
import { ColumnObject, RowRenderFunction } from "@/components/StyledTable/types"
import { StyledText } from "@/components/StyledText"
import { Tooltip } from "@/components/Tooltip"
import {
  estimatedRewardsTooltip,
  VOTE_SHARE_THRESHOLD,
  voteThresholdTooltip,
} from "@/components/ToolTips"
import { VoteButton } from "@/components/VoteButton"
import { WelcomePopup } from "@/components/WelcomePopup"
import { useUserVotingData } from "@/hooks/hooks"
import { amountToUSDString } from "@/lib/amountToUSDString"
import { useDecoratedProposals } from "@/lib/useDecoratedProposals"
import { useChain } from "@cosmos-kit/react"
import Image from "next/image"
import Link from "next/link"
import { Fragment, ReactNode, useCallback, useMemo } from "react"
import { twMerge } from "tailwind-merge"
import { classNames } from "./classNames"

export default function ActiveProposalsPage() {
  const { globalState } = useAppContext()
  const {
    totalLockedTokens,
    constants: { max_locked_tokens },
  } = globalState
  const { isWalletConnected, address } = useChain("neutron")
  const { data: myUserVotingData, isPending: myUserVotingDataIsPending } =
    useUserVotingData(address ?? "")
  const decoratedProposals =
    useDecoratedProposals({
      trancheId: 1,
    }) || []
  const hasVoted = decoratedProposals?.some(
    (proposal) => proposal.hasVotedOnProp
  )
  const votingPower = myUserVotingData?.votingPower ?? 0
  const showWelcomeModal =
    Math.round((totalLockedTokens / (max_locked_tokens ?? 1)) * 100) < 100 &&
    !myUserVotingDataIsPending &&
    votingPower <= 0

  type Row = {
    _proposal: (typeof decoratedProposals)[number]
    name: ReactNode
    yourEstimatedReward: ReactNode
    currentVoteShare: ReactNode
    actions: ReactNode
  }

  const [rowsForTokenBasedTributes, rowsWithPointBasedTributes] = useMemo<
    [Row[], Row[]]
  >(() => {
    const withTokens: Row[] = []
    const withPoints: Row[] = []

    decoratedProposals.forEach((proposal) => {
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
          This project is using a point system. Voters get points instead of
          live tokens.{" "}
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
            <Icon name="solid:circle" className="text-xs text-palette-beige" />
          </Tooltip>
        ) : null
      const row = {
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

        yourEstimatedReward: (
          <>
            {proposal.points ? (
              <Tooltip tipContents={pointSystemTooltip}>
                {votingPower ? (
                  <>
                    <div className="whitespace-nowrap">
                      <Icon name="solid:gem" />{" "}
                      {(
                        Number(proposal.points?.[0] ?? 0) *
                        (votingPower /
                          (Number(proposal.power ?? 0) + votingPower))
                      ).toLocaleString("en-US")}
                    </div>
                    <StyledText
                      variant="footnote"
                      as="div"
                      className="whitespace-nowrap"
                    >
                      of {proposal.points?.[0].toLocaleString("en-US")}{" "}
                      {proposal.points?.[1]}
                    </StyledText>
                  </>
                ) : (
                  <>
                    <Icon name="solid:gem" />{" "}
                    {proposal.points?.[0].toLocaleString("en-US")}{" "}
                    {proposal.points?.[1]}
                  </>
                )}
              </Tooltip>
            ) : (
              <Tooltip
                tipContents={estimatedRewardsTooltip({
                  totalTribute: proposal.totalTributeValue,
                  percentageOfTribute: Number(proposal.percentage),
                })}
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
                      {amountToUSDString(proposal.estimatedRewardForUser ?? 0)}
                    </div>
                    {isWalletConnected && (
                      <StyledText
                        variant="footnote"
                        as="div"
                        className="whitespace-nowrap"
                      >
                        of {amountToUSDString(proposal.totalTributeValue)}
                      </StyledText>
                    )}
                  </>
                )}
              </Tooltip>
            )}
            <Link href={projectLink} className={classNames.projectLink} />
          </>
        ),

        currentVoteShare: (
          <>
            <div className="flex flex-row-reverse items-center gap-1">
              {proposal.percentage}%{voteShareTooltip}
            </div>
            <Link href={projectLink} className={classNames.projectLink} />
          </>
        ),

        actions: (
          <>
            <VoteButton proposal={proposal} size="small" />
            <Link href={projectLink} className={classNames.projectLink} />
          </>
        ),
      }

      if (proposal.points) {
        withPoints.push(row as any)
      } else {
        withTokens.push(row as any)
      }
    })

    return [withTokens, withPoints]
  }, [decoratedProposals, isWalletConnected, hasVoted, votingPower])

  const buildColumns = useCallback(
    (
      projectBidLabel: string
    ): ColumnObject<
      (typeof rowsForTokenBasedTributes)[number],
      keyof (typeof rowsForTokenBasedTributes)[number]
    >[] => [
      {
        key: "name",
        label: (
          <div className="flex items-center gap-1">
            {projectBidLabel}
            <Tooltip
              tipContents={
                <>
                  Bids are submitted by projects. You can only vote once (per
                  bucket per tranche) but you can switch your vote as many times
                  as you want
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
            <Tooltip tipContents={estimatedRewardsTooltip()} />
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
                  This is the percentage of votes that this project has received
                  so far. It may increase or decrease if other users decide to
                  switch their votes before the round ends
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
    ],
    [isWalletConnected, classNames.classNamesForCells, hasVoted]
  )

  const renderRow = useCallback<
    RowRenderFunction<
      (typeof rowsForTokenBasedTributes)[number],
      keyof (typeof rowsForTokenBasedTributes)[number]
    >
  >(
    ({
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
      const nextRow = sortedRows?.[rowIndex + 1] as (typeof sortedRows)[number]

      const shouldShowVoteThresholdLine =
        sortedColumnKey === "currentVoteShare" &&
        previousRow &&
        nextRow &&
        Number(previousRow._proposal.percentage) >= VOTE_SHARE_THRESHOLD &&
        Number(row._proposal.percentage) < VOTE_SHARE_THRESHOLD

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
              row._proposal.hasVotedOnProp ? classNames.hasVotedRow : undefined
            }
            key={row._proposal.proposal_id}
            {...rowProps}
          >
            {children}
          </TR>
        </Fragment>
      )
    },
    [classNames.hasVotedRow, voteThresholdTooltip]
  )

  return (
    <>
      <MaxReachedPopup />
      <WelcomePopup showModal={false} />

      <StatCards>
        <StatCards.TotalTributes />
        <StatCards.AverageAPR />
        <StatCards.DaysRemaining />
      </StatCards>

      <ContentContainer className="gap-12 py-12">
        <div className={classNames.container}>
          {decoratedProposals?.length ? (
            <>
              <StyledTable
                initialSortedColumnKey="yourEstimatedReward"
                columns={buildColumns("Token-Based Tributes")}
                rows={rowsForTokenBasedTributes}
                renderRow={renderRow}
              />
            </>
          ) : (
            <div className={classNames.noBids}>
              <p>There are no bids available at this moment.</p>
            </div>
          )}
        </div>

        <div className={classNames.container}>
          <StyledTable
            initialSortedColumnKey="yourEstimatedReward"
            columns={buildColumns("Points-Based Tributes")}
            rows={rowsWithPointBasedTributes}
            renderRow={renderRow}
          />
        </div>
      </ContentContainer>
    </>
  )
}
