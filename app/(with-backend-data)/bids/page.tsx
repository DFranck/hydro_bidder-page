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
  polDurationTooltip,
  VOTE_SHARE_THRESHOLD,
  voteThresholdTooltip,
} from "@/components/ToolTips"
import { VoteButton } from "@/components/VoteButton"
import { useBackendData } from "@/contract-apis/useBackendData"
import groupBy from "lodash/groupBy"
import mapValues from "lodash/mapValues"
import { Fragment, useMemo } from "react"
import { twJoin } from "tailwind-merge"
import { classNames } from "./classNames"

export const dynamic = "force-dynamic"

export default function BidsPage() {
  const backendData = useBackendData()

  const {
    bidsInfo,
    bidMetaDataById,
    currentRoundId,
    isLoading,
    tranches,
    votesByRoundId,
  } = backendData

  const bidsInRound = Object.values(bidsInfo).filter(
    (bid) => bid.roundId === currentRoundId
  )

  const bidsByTrancheId = useMemo(
    () => groupBy(bidsInRound, "trancheId"),
    [bidsInRound]
  )

  const rowsByTrancheId = useMemo(
    () =>
      mapValues(
        bidsByTrancheId,
        (bidsInTranche) =>
          bidsInTranche?.map((bid) => {
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
                    condition={bid.vote_perc < VOTE_SHARE_THRESHOLD}
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
                      <span>{Math.round(bid.vote_perc)}</span>
                      <StyledText variant="mathSymbol">%</StyledText>
                    </StyledText>
                  </ConditionalWrapper>
                </InvisibleLink>
              ),

              actions: (
                <InvisibleLink href={bidURL}>
                  <div className="flex items-center justify-end gap-3">
                    <VoteButton bidId={bid.id} size="small" />
                    <StyledText
                      variant="link"
                      className={classNames.bidDetailsLink}
                    >
                      <span className="sr-only">Bid Details</span>{" "}
                      <Icon name="chevron-right" />
                    </StyledText>
                  </div>
                </InvisibleLink>
              ),
            }
          }) ?? []
      ),
    [bidsByTrancheId]
  )

  type Row = (typeof rowsByTrancheId)[number][number]

  const columns = useMemo((): ColumnObject<Row, keyof Row>[] => {
    return [
      {
        key: "logoAndTitle",
        label: (
          <Tooltip
            tipContents={bidTablesFirstColumnTooltips.bidsTable.tokenBased}
          >
            <div className="flex items-center gap-1">
              Title
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
        customValueGetter: (row) => row._bid.duration,
      },
      {
        key: "tributeApr",
        label: (
          <Tooltip tipContents={liveBidTributeAprColumnTooltip}>
            <div className="flex items-center gap-1">
              <span>Tribute APR</span>
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
          return row._bid.apr_tribute ?? 0
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
        customValueGetter: (row) => row._bid.vote_perc,
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
  }, [bidsInfo, bidMetaDataById, currentRoundId, votesByRoundId])

  function renderRow({
    children,
    row,
    rowProps,
    sortDirection,
    sortedColumnKey,
  }: RowRenderProps<Row, keyof Row>) {
    const shouldShowVoteThresholdLine =
      sortedColumnKey === "currentVoteShare" &&
      sortDirection === "DESC" &&
      row._bid.vote_perc < VOTE_SHARE_THRESHOLD

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

  return (
    <>
      <StatCards>
        <StatCards.CurrentRoundNumberOfBids />
        <StatCards.CurrentRoundAprGlobal />
        <StatCards.CurrentRoundTimeLeft />
      </StatCards>

      <ContentContainer className="gap-12 py-6 outline">
        <LoadingSpinner isLoading={isLoading} />

        {!isLoading && bidsInRound.length === 0 && (
          <BlurryBackdropBox>
            <EmptyBox>There are no bids available at this moment.</EmptyBox>
          </BlurryBackdropBox>
        )}

        {!isLoading &&
          bidsInRound.length > 0 &&
          Object.entries(rowsByTrancheId).map(([trancheId, rowsInTranche]) => {
            const tranche = tranches.find((t) => t.id === Number(trancheId))
            return (
              <BlurryBackdropBox
                key={trancheId}
                className="flex flex-col gap-3"
              >
                <div
                  className={twJoin(
                    "flex items-center justify-between",
                    "rounded-t-md bg-palette-beige/20",
                    "-mx-2 -my-1 px-6 py-3"
                  )}
                >
                  <StyledText variant="h4">
                    {tranche?.name ?? <em>(Unnamed Tranche)</em>}
                  </StyledText>

                  {/* <div
                    className={twJoin(
                      "flex items-center justify-end gap-1",
                      "text-xs text-palette-beige"
                    )}
                  >
                    <Icon name="triangle-exclamation" />
                    <span>Connect your wallet to vote</span>
                  </div> */}
                </div>

                <StyledTable
                  initialSortedColumnKey="currentVoteShare"
                  columns={columns}
                  rows={rowsInTranche}
                  renderRow={renderRow}
                />
              </BlurryBackdropBox>
            )
          })}
      </ContentContainer>
    </>
  )
}
