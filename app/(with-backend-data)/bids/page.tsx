"use client"

import { BidDenoms } from "@/components/BidDenoms"
import { BidRewards } from "@/components/BidRewards"
import { BlurryBackdropBox } from "@/components/BlurryBackdropBox"
import { ConditionalWrapper } from "@/components/ConditionalWrapper"
import { ContentContainer } from "@/components/ContentContainer"
import { EmptyBox } from "@/components/EmptyBox"
import { Icon } from "@/components/Icon"
import { InvisibleLink } from "@/components/InvisibleLink"
import { LoadingSpinner } from "@/components/LoadingSpinner"
import { PopupOnWelcome } from "@/components/PopupOnWelcome"
import { StatCards } from "@/components/StatCards"
import { StyledTable, TD, TR } from "@/components/StyledTable"
import { ColumnObject, RowRenderFunction } from "@/components/StyledTable/types"
import { StyledText } from "@/components/StyledText"
import { Tooltip } from "@/components/Tooltip"
import {
  bidTypeColumnTooltip,
  currentVoteShareTooltip,
  estimatedRewardsColumnTooltip,
  polDurationTooltip,
  VOTE_SHARE_THRESHOLD,
  voteThresholdTooltip,
} from "@/components/ToolTips"
import { VoteButton } from "@/components/VoteButton"
import { useBackendData } from "@/contract-apis/useBackendData"
import { getTimeUnitFromNanos } from "@/lib/getTimeUnitFromNanos"
import { pluralize } from "@/lib/pluralize"
import { sumBy } from "lodash"
import Image from "next/image"
import { Fragment, useCallback } from "react"
import { classNames } from "./classNames"

const tokenBasedTributesLabel = "Token-Based Tributes"
const pointBasedTributesLabel = "Points-Based Tributes"

export default function BidsPage() {
  const backendData = useBackendData()

  const {
    bidDescriptionsByBidId,
    bidsByRoundId,
    currentRoundId,
    isLoading,
    isWalletConnected,
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
          <InvisibleLink href={bidURL} className="flex items-center gap-6">
            {projectLogoUrl ? (
              <div className={classNames.bidLogo}>
                <Image
                  className="object-contain"
                  src={projectLogoUrl}
                  alt={projectName}
                  fill={true}
                />
              </div>
            ) : null}

            <div>
              <p className={classNames.bidTitle}>{bid.title}</p>

              <StyledText variant="footnote">
                <BidDenoms bid={bid} />
              </StyledText>
            </div>
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
        yourEstimatedReward: (
          <InvisibleLink href={bidURL}>
            <BidRewards bidId={bid.id} />
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

  const buildColumns = useCallback(
    (
      projectBidLabel: string
    ): ColumnObject<(typeof rows)[number], keyof (typeof rows)[number]>[] => {
      const isTokenBased = projectBidLabel === tokenBasedTributesLabel

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
                {projectBidLabel}
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
          key: "yourEstimatedReward",
          label: (
            <Tooltip
              tipContents={estimatedRewardsColumnTooltip({
                hasVotedThisRound,
                isTokenBased,
              })}
            >
              <div className="flex items-center gap-1">
                <span>
                  {!isTokenBased
                    ? "Total Tribute"
                    : hasVotedThisRound
                      ? "Your Est. Reward"
                      : "Total Est. Reward"}{" "}
                </span>
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
    },
    [
      backendData,
      classNames.classNamesForCells,
      isWalletConnected,
      tokenBasedTributesLabel,
    ]
  )

  const renderRow = useCallback<
    RowRenderFunction<(typeof rows)[number], keyof (typeof rows)[number]>
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
    },
    [classNames.hasVotedRow, voteThresholdTooltip]
  )

  const tokenBasedBids = rows.filter((row) =>
    row._bid.tributes.every((t) => t.isTokenBased)
  )
  const pointBasedBids = rows.filter(
    (row) => false === row._bid.tributes.every((t) => t.isTokenBased)
  )

  return (
    <>
      {/* <PopupOnMaxReached /> */}

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
              initialSortedColumnKey="yourEstimatedReward"
              columns={buildColumns(tokenBasedTributesLabel)}
              rows={tokenBasedBids}
              renderRow={renderRow}
            />
          </BlurryBackdropBox>
        )}

        {!isLoading && pointBasedBids.length > 0 && (
          <BlurryBackdropBox>
            <StyledTable
              initialSortedColumnKey="yourEstimatedReward"
              columns={buildColumns(pointBasedTributesLabel)}
              rows={pointBasedBids}
              renderRow={renderRow}
            />
          </BlurryBackdropBox>
        )}
      </ContentContainer>
    </>
  )
}
