"use client"

import { BidDuration } from "@/components/BidDuration"
import { BidLogoAndTitle } from "@/components/BidLogoAndTitle"
import { BidTributeAprOrPoints } from "@/components/BidTributeAprOrPoints"
import { BlurryBackdropBox } from "@/components/BlurryBackdropBox"
import { ConditionalWrapper } from "@/components/ConditionalWrapper"
import { ContentContainer } from "@/components/ContentContainer"
import { EmptyBox } from "@/components/EmptyBox"
import { Icon } from "@/components/Icon"
import { InvisibleLink } from "@/components/InvisibleLink"
import { LoadingSpinner } from "@/components/LoadingSpinner"
import { StatCards } from "@/components/StatCards"
import { StyledTable, TD, TR } from "@/components/StyledTable"
import { ColumnObject, RowRenderProps } from "@/components/StyledTable/types"
import { StyledText } from "@/components/StyledText"
import { Tooltip } from "@/components/Tooltip"
import {
  bidTablesFirstColumnTooltips,
  currentVoteShareTooltip,
  liveBidTributeAprColumnTooltip,
  metricsTributeColumnTooltip,
  polDurationTooltip,
  VOTE_SHARE_THRESHOLD,
  voteThresholdTooltip,
} from "@/components/ToolTips"
import { VoteButton } from "@/components/VoteButton"
import { useBackendData } from "@/contract-apis/useBackendData"
import { Fragment } from "react"
import { classNames } from "./classNames"

export const dynamic = "force-dynamic"

export default function BidsPage() {
  const backendData = useBackendData()

  const { bidsById, currentRoundId, isLoading, votesByRoundId } = backendData

  const bidsInRound = Object.values(bidsById).filter(
    (bid) => bid.roundId === currentRoundId
  )

  const rows =
    bidsInRound?.map((bid) => {
      const bidURL = `/bids/${bid.id}`

      return {
        _bid: bid,

        logoAndTitle: (
          <InvisibleLink href={bidURL}>
            <BidLogoAndTitle bidId={bid.id} />
          </InvisibleLink>
        ),

        duration: (
          <InvisibleLink href={bidURL}>
            <BidDuration bidId={bid.id} />
          </InvisibleLink>
        ),

        tributeApr: (
          <InvisibleLink href={bidURL}>
            <BidTributeAprOrPoints bidId={bid.id} />
          </InvisibleLink>
        ),

        currentVoteShare: (
          <InvisibleLink
            href={bidURL}
            className="flex flex-row-reverse items-center gap-1"
          >
            <ConditionalWrapper
              condition={bid.percentage < VOTE_SHARE_THRESHOLD}
              wrapper={(children) => (
                <Tooltip
                  tipContents={voteThresholdTooltip}
                  classNamesForTooltip="-ml-24"
                >
                  <div className="flex items-center gap-1">
                    {children}
                    <Icon
                      name="circle-info"
                      className="text-xs text-palette-beige"
                    />
                  </div>
                </Tooltip>
              )}
            >
              <StyledText variant="mathSymbol.container">
                <span>{Math.round(bid.percentage)}</span>
                <StyledText variant="mathSymbol">%</StyledText>
              </StyledText>
            </ConditionalWrapper>
          </InvisibleLink>
        ),

        actions: (
          <InvisibleLink href={bidURL}>
            <div className="flex items-center justify-end gap-3">
              <VoteButton bidId={bid.id} size="small" />
              <StyledText variant="link" className={classNames.bidDetailsLink}>
                <span className="sr-only">Bid Details</span>{" "}
                <Icon name="chevron-right" />
              </StyledText>
            </div>
          </InvisibleLink>
        ),
      }
    }) ?? []

  type Row = (typeof rows)[number]

  function buildColumns({
    isTokenBased,
  }: {
    isTokenBased: boolean
  }): ColumnObject<Row, keyof Row>[] {
    return [
      {
        key: "logoAndTitle",
        label: (
          <Tooltip
            tipContents={
              bidTablesFirstColumnTooltips.bidsTable[
                isTokenBased ? "tokenBased" : "pointBased"
              ]
            }
          >
            <div className="flex items-center gap-1">
              {isTokenBased ? "Token-Based Tribute" : "Point-Based Tribute"}
              <Icon name="circle-info" />
            </div>
          </Tooltip>
        ),
        isSortable: true,
        propsForCells: {
          className: classNames.classNamesForCells,
        },
        customValueGetter: (row) => row._bid.title,
      },
      {
        key: "duration",
        label: (
          <Tooltip tipContents={polDurationTooltip}>
            <div className="flex items-center gap-1">
              <span>Duration</span>
              <Icon name="circle-info" />
            </div>
          </Tooltip>
        ),
        isSortable: true,
        textAlign: "right",
        initialSortDirection: "DESC",
        propsForCells: {
          className: classNames.classNamesForCells,
        },
        customValueGetter: (row) => row._bid.deploymentDurationInEpochs,
      },
      {
        key: "tributeApr",
        label: (
          <Tooltip
            tipContents={
              !isTokenBased
                ? metricsTributeColumnTooltip
                : liveBidTributeAprColumnTooltip
            }
          >
            <div className="flex items-center gap-1">
              <span>{!isTokenBased ? "Total Tribute" : "Tribute APR"}</span>
              <Icon name="circle-info" />
            </div>
          </Tooltip>
        ),
        isSortable: true,
        textAlign: "right",
        initialSortDirection: "DESC",
        propsForCells: {
          className: classNames.classNamesForCells,
        },
        customValueGetter: (row) => {
          const isTokenBased = row._bid.tributes.every((t) => t.isTokenBased)
          return !isTokenBased
            ? 0
            : currentRoundId === row._bid.roundId
              ? row._bid.tributeAprMax
              : row._bid.tributeApr
        },
      },
      {
        key: "currentVoteShare",
        label: (
          <Tooltip
            classNamesForTooltip="-ml-24"
            tipContents={currentVoteShareTooltip}
          >
            <div className="flex items-center gap-1">
              <span>Vote %</span>
              <Icon name="circle-info" />
            </div>
          </Tooltip>
        ),
        isSortable: true,
        initialSortDirection: "DESC",
        textAlign: "right",
        propsForCells: {
          className: classNames.classNamesForCells,
        },
        customValueGetter: (row) => row._bid.percentage,
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
    ]
  }

  function renderRow({
    children,
    row,
    rowProps,
    sortDirection,
    sortedColumnKey,
  }: RowRenderProps<(typeof rows)[number], keyof (typeof rows)[number]>) {
    const shouldShowVoteThresholdLine =
      sortedColumnKey === "currentVoteShare" &&
      sortDirection === "DESC" &&
      row._bid.percentage < VOTE_SHARE_THRESHOLD

    const votesThisRound = votesByRoundId[currentRoundId] ?? []

    const userVotedForBid = votesThisRound.some(
      (vote) => vote.bidId === row._bid.id
    )

    return (
      <Fragment key={row._bid.id}>
        {!!shouldShowVoteThresholdLine && (
          <TR className="js-vote-threshold-line [&~&]:hidden">
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

                <Tooltip tipContents={voteThresholdTooltip}>
                  <div className="flex items-center gap-1">
                    <Icon name="solid:circle" />
                    <span>
                      These bids are below the{" "}
                      <strong>
                        {VOTE_SHARE_THRESHOLD}% vote share threshold
                      </strong>
                    </span>
                    <Icon name="circle-info" />
                  </div>
                </Tooltip>

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
          className={userVotedForBid ? classNames.hasVotedRow : undefined}
          key={row._bid.id}
          {...rowProps}
        >
          {children}
        </TR>
      </Fragment>
    )
  }

  const tokenBasedBids = rows.filter((row) =>
    row._bid.tributes.every((t) => t.isTokenBased)
  )
  const pointBasedBids = rows.filter(
    (row) => false === row._bid.tributes.every((t) => t.isTokenBased)
  )

  return (
    <>
      <StatCards>
        <StatCards.CurrentRoundNumberOfBids />
        <StatCards.CurrentRoundAprGlobal />
        <StatCards.CurrentRoundTimeLeft />
      </StatCards>

      <ContentContainer className="gap-12 py-6">
        <LoadingSpinner isLoading={isLoading} />

        {!isLoading && tokenBasedBids.length === 0 && (
          <BlurryBackdropBox>
            <EmptyBox>There are no bids available at this moment.</EmptyBox>
          </BlurryBackdropBox>
        )}

        {!isLoading && tokenBasedBids.length > 0 && (
          <BlurryBackdropBox>
            <StyledTable
              initialSortedColumnKey="currentVoteShare"
              columns={buildColumns({ isTokenBased: true })}
              rows={tokenBasedBids}
              renderRow={renderRow}
            />
          </BlurryBackdropBox>
        )}

        {!isLoading && pointBasedBids.length > 0 && (
          <BlurryBackdropBox>
            <StyledTable
              initialSortedColumnKey="currentVoteShare"
              columns={buildColumns({ isTokenBased: false })}
              rows={pointBasedBids}
              renderRow={renderRow}
            />
          </BlurryBackdropBox>
        )}
      </ContentContainer>
    </>
  )
}
