"use client"

import { BidLogoAndTitle } from "@/components/BidLogoAndTitle"
import { BidPolApr } from "@/components/BidPolApr"
import { BidTributeApr } from "@/components/BidTributeApr"
import { BlurryBackdropBox } from "@/components/BlurryBackdropBox"
import { ConditionalWrapper } from "@/components/ConditionalWrapper"
import { ContentContainer } from "@/components/ContentContainer"
import { EmptyBox } from "@/components/EmptyBox"
import { Icon } from "@/components/Icon"
import { InvisibleLink } from "@/components/InvisibleLink"
import { LoadingSpinner } from "@/components/LoadingSpinner"
import { PopupOnMaxReached } from "@/components/PopupOnMaxReached"
import { PopupOnWelcome } from "@/components/PopupOnWelcome"
import { StatCards } from "@/components/StatCards"
import { StyledTable, TD, TR } from "@/components/StyledTable"
import { ColumnObject, RowRenderProps } from "@/components/StyledTable/types"
import { StyledText } from "@/components/StyledText"
import { Tooltip } from "@/components/Tooltip"
import {
  bidTypeColumnTooltip,
  currentVoteShareTooltip,
  metricsPolAprColumnTooltip,
  metricsTributeAprColumnTooltip,
  metricsTributeColumnTooltip,
  polDurationTooltip,
  VOTE_SHARE_THRESHOLD,
  voteThresholdTooltip,
} from "@/components/ToolTips"
import { VoteButton } from "@/components/VoteButton"
import { useBackendData } from "@/contract-apis/useBackendData"
import { getTimeUnitFromNanos } from "@/lib/getTimeUnitFromNanos"
import { pluralize } from "@/lib/pluralize"
import { sumBy } from "lodash"
import { Fragment } from "react"
import { classNames } from "./classNames"

export default function BidsPage() {
  const backendData = useBackendData()

  const {
    bidDescriptionsByBidId,
    bidsByRoundId,
    currentRoundId,
    isLoading,
    metricsForPostHydroBids,
    votesByRoundId,
  } = backendData

  const bidsInRound = bidsByRoundId[currentRoundId] ?? []

  const votesInThisRound = votesByRoundId[currentRoundId] ?? []

  const hasVotedThisRound = votesInThisRound.length > 0

  const rows =
    bidsInRound?.map((bid) => {
      const bidURL = `/bids/${bid.id}`
      const bidDescription = bidDescriptionsByBidId[bid.id] ?? {}
      const { projectLogoUrl, projectName } = bidDescription
      const { value: bidDeploymentDurationToRender, unit } =
        getTimeUnitFromNanos(bid.deploymentDurationInNanos)

      return {
        _bid: bid,
        logoAndTitle: (
          <InvisibleLink href={bidURL}>
            <BidLogoAndTitle bidId={bid.id} />
          </InvisibleLink>
        ),
        duration: (
          <InvisibleLink href={bidURL}>
            {pluralize({
              count: bidDeploymentDurationToRender,
              prefixCount: true,
              singular: unit,
            })}
          </InvisibleLink>
        ),
        tributeApr: (
          <InvisibleLink href={bidURL}>
            <BidTributeApr bidId={bid.id} />
          </InvisibleLink>
        ),
        polApr: (
          <InvisibleLink href={bidURL}>
            <BidPolApr bidId={bid.id} />
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
              <span>{Math.round(bid.percentage)}%</span>
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
            tipContents={bidTypeColumnTooltip({
              isTokenBased,
            })}
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
        key: "polApr",
        label: (
          <Tooltip tipContents={metricsPolAprColumnTooltip}>
            <div className="flex items-center gap-1">
              PoL APR
              <Icon name="circle-info" />
            </div>
          </Tooltip>
        ),
        textAlign: "right",
        propsForCells: {
          className: "whitespace-nowrap",
        },
        isSortable: true,
        initialSortDirection: "DESC",
        customValueGetter: (row) => {
          const bidFromNumia = metricsForPostHydroBids.find(
            (bid) => Number(bid.id) === row._bid.id
          )
          return bidFromNumia?.apr ?? 0
        },
      },
      {
        key: "tributeApr",
        label: (
          <Tooltip
            tipContents={
              !isTokenBased
                ? metricsTributeColumnTooltip
                : metricsTributeAprColumnTooltip
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
            : hasVotedThisRound
              ? row._bid.usersEstimatedRewards
              : sumBy(row._bid.tributes, "valueInUsd")
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
        customValueGetter: (row) => Number(row._bid.percentage),
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
    rowIndex,
    rowProps,
    sortedColumnKey,
    sortedRows,
  }: RowRenderProps<(typeof rows)[number], keyof (typeof rows)[number]>) {
    const previousRow = sortedRows?.[
      rowIndex - 1
    ] as (typeof sortedRows)[number]
    const nextRow = sortedRows?.[rowIndex + 1] as (typeof sortedRows)[number]

    const shouldShowVoteThresholdLine =
      sortedColumnKey === "currentVoteShare" &&
      previousRow &&
      nextRow &&
      Number(previousRow._bid.percentage) >= VOTE_SHARE_THRESHOLD &&
      Number(row._bid.percentage) < VOTE_SHARE_THRESHOLD

    const votesThisRound = votesByRoundId[currentRoundId] ?? []

    const userVotedForBid = votesThisRound.some(
      (vote) => vote.bidId === row._bid.id
    )

    return (
      <Fragment key={row._bid.id}>
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
      {process.env.NODE_ENV !== "development" && <PopupOnMaxReached />}

      <PopupOnWelcome />

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
              initialSortedColumnKey="tributeApr"
              columns={buildColumns({ isTokenBased: true })}
              rows={tokenBasedBids}
              renderRow={renderRow}
            />
          </BlurryBackdropBox>
        )}

        {!isLoading && pointBasedBids.length > 0 && (
          <BlurryBackdropBox>
            <StyledTable
              initialSortedColumnKey="tributeApr"
              columns={buildColumns({ isTokenBased: false }).filter(
                (column) => column.key !== "polApr"
              )}
              rows={pointBasedBids}
              renderRow={renderRow}
            />
          </BlurryBackdropBox>
        )}
      </ContentContainer>
    </>
  )
}
