"use client"

import { AmountAndUnitPair } from "@/components/AmountAndUnitPair"
import { BidDuration } from "@/components/BidDuration"
import { BidLogoAndTitle } from "@/components/BidLogoAndTitle"
import { BidPolApr } from "@/components/BidPolApr"
import { BidPolSize } from "@/components/BidPolSize"
import { BidStatus } from "@/components/BidStatus"
import { BidTributeAprOrPoints } from "@/components/BidTributeAprOrPoints"
import { BlurryBackdropBox } from "@/components/BlurryBackdropBox"
import { ConditionalWrapper } from "@/components/ConditionalWrapper"
import { ContentContainer } from "@/components/ContentContainer"
import { Icon } from "@/components/Icon"
import { InvisibleLink } from "@/components/InvisibleLink"
import { StatCards } from "@/components/StatCards"
import { StyledTable, TD, TR } from "@/components/StyledTable"
import { ColumnObject, RowRenderFunction } from "@/components/StyledTable/types"
import { StyledText } from "@/components/StyledText"
import { Tooltip } from "@/components/Tooltip"
import {
  bidTablesFirstColumnTooltips,
  liveBidTributeAprColumnTooltip,
  metricsDurationColumnTooltip,
  metricsPageNoDataTooltip,
  metricsPolRewardsColumnTooltip,
  metricsPolSizeColumnTooltip,
  metricsStatusColumnTooltip,
  metricsTributeColumnTooltip,
  pastBidTributeAprColumnTooltip,
  VOTE_SHARE_THRESHOLD,
  voteThresholdTooltip,
} from "@/components/ToolTips"
import { useBackendData } from "@/contract-apis/useBackendData"
import { pluralize } from "@/lib/pluralize"
import max from "lodash/max"
import range from "lodash/range"
import sumBy from "lodash/sumBy"
import uniq from "lodash/uniq"
import Image from "next/image"
import Link from "next/link"
import { Fragment, useCallback } from "react"
import { twJoin, twMerge } from "tailwind-merge"

const PRE_HYDRO_ROUND_ID = -1

export function MetricsPage({
  requestedRoundNumber,
}: {
  requestedRoundNumber: number | null
}) {
  const {
    bidsById,
    bidDescriptionsByBidId,
    currentRoundId,
    metricsForPreHydroBids,
    metricsForPostHydroBids,
  } = useBackendData()

  const postHydroRoundIdsWithBidData = uniq(
    metricsForPostHydroBids.map((bid) => Number(bid.roundId))
  )

  const highestRoundIdWithData =
    max(postHydroRoundIdsWithBidData) ?? PRE_HYDRO_ROUND_ID

  const requestedRoundId =
    requestedRoundNumber === null
      ? Math.min(highestRoundIdWithData, currentRoundId - 1)
      : typeof requestedRoundNumber === "number" && requestedRoundNumber >= 1
        ? Math.min(requestedRoundNumber - 1, highestRoundIdWithData)
        : PRE_HYDRO_ROUND_ID

  const requestedPreHydro = requestedRoundId === PRE_HYDRO_ROUND_ID

  const bidsToRender = requestedPreHydro
    ? metricsForPreHydroBids
    : metricsForPostHydroBids.filter((bid) => bid.roundId === requestedRoundId)

  const tokenBasedBids = bidsToRender.filter(
    (bid) => bid.offchainTribute.length === 0
  )
  const pointBasedBids = bidsToRender.filter(
    (bid) => bid.offchainTribute.length > 0
  )

  const tokenBasedRows = buildRows({
    bidsFromNumia: tokenBasedBids,
    isTokenBased: true,
  })
  const pointBasedRows = buildRows({
    bidsFromNumia: pointBasedBids,
    isTokenBased: false,
  })

  type Row = (typeof tokenBasedRows)[number]

  const tokenBasedColumns = buildColumns({ isTokenBased: true })
  const pointBasedColumns = buildColumns({ isTokenBased: false }).filter(
    (column) => column.key !== "polApr"
  )

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
              bidTablesFirstColumnTooltips.metricsTable[
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
        initialSortDirection: "ASC",
        customValueGetter: (row) => row._bid.title,
      },
      {
        key: "amount",
        label: (
          <Tooltip tipContents={metricsPolSizeColumnTooltip}>
            <div className="flex items-center gap-1">
              Amount
              <Icon name="circle-info" />
            </div>
          </Tooltip>
        ),
        textAlign: "right",
        propsForCells: {
          className: "text-balance",
        },
        isSortable: true,
        initialSortDirection: "DESC",
        customValueGetter: (row) => row._bid.initialAllocationAmount,
      },
      {
        key: "duration",
        label: (
          <Tooltip tipContents={metricsDurationColumnTooltip}>
            <div className="flex items-center gap-1">
              Duration
              <Icon name="circle-info" />
            </div>
          </Tooltip>
        ),
        textAlign: "right",
        propsForCells: {
          className: "whitespace-nowrap",
        },
        isSortable: true,
        initialSortDirection: "ASC",
        customValueGetter: (row) => row._bid.durationDays,
      },
      {
        key: "polApr",
        label: (
          <Tooltip tipContents={metricsPolRewardsColumnTooltip}>
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
        customValueGetter: (row) => row._bid.apr,
      },
      {
        key: "tributeApr",
        label: (
          <Tooltip
            tipContents={
              !isTokenBased
                ? metricsTributeColumnTooltip
                : requestedRoundId === currentRoundId
                  ? liveBidTributeAprColumnTooltip
                  : pastBidTributeAprColumnTooltip
            }
            classNamesForTooltip="-ml-12"
          >
            <div className="flex items-center gap-1">
              {!isTokenBased ? "Tribute" : "Tribute APR"}
              <Icon name="circle-info" />
            </div>
          </Tooltip>
        ),
        textAlign: "right",
        isSortable: true,
        initialSortDirection: "DESC",
        customValueGetter: (row) => {
          const bidFromContract = bidsById[Number(row._bid.id)]
          return !isTokenBased
            ? sumBy(row._bid.offchainTribute, "amount")
            : (bidFromContract?.tributeApr ?? 0)
        },
      },
      {
        key: "status",
        label: (
          <Tooltip
            tipContents={metricsStatusColumnTooltip}
            classNamesForTooltip="-ml-12"
          >
            <div className="flex items-center gap-1">
              Status
              <Icon name="circle-info" />
            </div>
          </Tooltip>
        ),
        textAlign: "right",
        propsForCells: {
          className: "text-balance",
        },
        isSortable: true,
        initialSortDirection: "ASC",
        customValueGetter: (row) =>
          "status" in row._bid ? row._bid.status : "",
      },
    ]
  }

  function buildRows({
    bidsFromNumia,
    isTokenBased,
  }: {
    bidsFromNumia: typeof bidsToRender
    isTokenBased: boolean
  }) {
    return bidsFromNumia.map((bidFromNumia) => {
      const bidDescriptionFromGithub =
        bidDescriptionsByBidId[Number(bidFromNumia.id)] ?? null
      const bidFromContract = bidsById[Number(bidFromNumia.id)] ?? null
      const percentage = bidFromContract?.percentage ?? null
      const rowURL =
        requestedRoundId === PRE_HYDRO_ROUND_ID
          ? `https://www.mintscan.io/cosmos/proposals/${bidFromNumia.id.replace("#", "")}`
          : `/bids/${bidFromNumia.id}`
      const projectLogoUrl =
        bidFromNumia.projectLogoUrl || bidDescriptionFromGithub?.projectLogoUrl
      const projectName =
        bidFromNumia.projectName || bidDescriptionFromGithub?.projectName
      const title = bidFromNumia.title || bidDescriptionFromGithub?.title

      return {
        _bid: { ...bidFromNumia, percentage },

        logoAndTitle: (
          <InvisibleLink href={rowURL}>
            {requestedPreHydro ? (
              <div className="flex items-center gap-6">
                <div className="relative size-12 shrink-0 rounded-full border text-[0]">
                  {projectLogoUrl ? (
                    <Image
                      className="object-contain"
                      src={projectLogoUrl}
                      alt={projectName}
                      fill={true}
                    />
                  ) : null}
                </div>

                <StyledText variant="h4">{title}</StyledText>
              </div>
            ) : (
              <BidLogoAndTitle bidId={Number(bidFromNumia.id)} />
            )}
          </InvisibleLink>
        ),

        amount: (
          <InvisibleLink href={rowURL}>
            {requestedPreHydro ? (
              <AmountAndUnitPair
                amount={bidFromNumia.initialAllocationAmount.toLocaleString(
                  undefined,
                  {
                    maximumFractionDigits: 4,
                  }
                )}
                unit="ATOM"
              />
            ) : (
              <BidPolSize bidId={Number(bidFromNumia.id)} />
            )}
          </InvisibleLink>
        ),

        duration: (
          <InvisibleLink href={rowURL}>
            {requestedPreHydro ? (
              pluralize({
                count: bidFromNumia.durationDays,
                prefixCount: true,
                singular: "day",
              })
            ) : (
              <BidDuration bidId={Number(bidFromNumia.id)} />
            )}
          </InvisibleLink>
        ),

        polApr: !isTokenBased ? undefined : (
          <InvisibleLink href={rowURL}>
            {requestedPreHydro ? (
              <StyledText variant="mathSymbol.container">
                <span>{bidFromNumia.apr}</span>
                <StyledText variant="mathSymbol">%</StyledText>
              </StyledText>
            ) : (
              <BidPolApr bidId={Number(bidFromNumia.id)} />
            )}
          </InvisibleLink>
        ),

        tributeApr: (
          <InvisibleLink href={rowURL}>
            {requestedPreHydro ? (
              0
            ) : (
              <BidTributeAprOrPoints bidId={bidFromContract.id} />
            )}
          </InvisibleLink>
        ),

        status: (
          <InvisibleLink href={rowURL}>
            {requestedPreHydro ? (
              bidFromNumia.status
            ) : (
              <BidStatus bidId={Number(bidFromNumia.id)} />
            )}
          </InvisibleLink>
        ),
      }
    })
  }

  function secondPassSortFunction(sortedRows: Row[]) {
    return [...sortedRows].sort((a, b) => {
      const aExceedsThreshold =
        a._bid.percentage && a._bid.percentage >= VOTE_SHARE_THRESHOLD
      const bExceedsThreshold =
        b._bid.percentage && b._bid.percentage >= VOTE_SHARE_THRESHOLD
      return Number(bExceedsThreshold) - Number(aExceedsThreshold)
    })
  }

  const renderRow = useCallback<RowRenderFunction<Row, keyof Row>>(
    ({ children, row, rowProps }) => {
      const shouldShowVoteThresholdLine =
        row._bid.percentage !== null &&
        row._bid.percentage < VOTE_SHARE_THRESHOLD

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
          <TR key={row._bid.id} {...rowProps}>
            {children}
          </TR>
        </Fragment>
      )
    },
    [voteThresholdTooltip]
  )

  return (
    <>
      <StatCards>
        <StatCards.CurrentRoundPoLAvailable />
        <StatCards.AllTimePoLDeployed />
        <StatCards.AllTimePoLRevenue />
      </StatCards>

      <ContentContainer className="gap-6 py-6">
        <div
          id="metrics-page-round-navigation"
          className="flex items-center justify-between"
        >
          <h2 className="sr-only">PoL Metrics by Round</h2>

          <div>
            <StyledText as="p" variant="footnote">
              Metrics are updated at the end of each round.
            </StyledText>
          </div>

          <div className="flex items-center backdrop-blur-sm">
            {[PRE_HYDRO_ROUND_ID, ...range(currentRoundId + 1)].map(
              (roundId) => {
                const isActive = roundId === requestedRoundId
                const hasData = roundId <= highestRoundIdWithData

                return (
                  <StyledText
                    as={Link}
                    variant={isActive ? "button.primary" : "button.secondary"}
                    href={hasData ? `/metrics/${roundId + 1}` : "#"}
                    key={roundId}
                    className={twMerge(
                      "group relative -mx-px rounded-none backdrop-blur-none",
                      "first:rounded-l-full last:rounded-r-full",
                      "hover:scale-100",
                      "transition-all",
                      !isActive &&
                        "text-palette-green/50 hover:text-palette-green",
                      !hasData && "cursor-default"
                    )}
                  >
                    <ConditionalWrapper
                      condition={!hasData}
                      wrapper={(children) => (
                        <Tooltip tipContents={metricsPageNoDataTooltip}>
                          {children}
                        </Tooltip>
                      )}
                    >
                      <span>
                        {roundId === -1 ? "Pre-Hydro" : `Round ${roundId + 1}`}
                      </span>
                    </ConditionalWrapper>
                    {roundId === currentRoundId && (
                      <span
                        className={twJoin(
                          "absolute left-1/2 top-full -translate-x-1/2 -translate-y-1/4",
                          "rounded-full px-2 py-0.5 transition-all",
                          "border-2 border-palette-text bg-palette-text text-xs",
                          "before:absolute before:inset-0 before:-z-10 before:rounded-full",
                          "group-hover:text-palette-text group-hover:before:bg-palette-beige",
                          isActive
                            ? "text-palette-text before:bg-palette-beige"
                            : "text-palette-text/50 before:bg-palette-beige/60"
                        )}
                      >
                        Current
                      </span>
                    )}
                  </StyledText>
                )
              }
            )}
          </div>
        </div>

        {tokenBasedRows.length > 0 && (
          <BlurryBackdropBox>
            <StyledTable
              columns={tokenBasedColumns}
              rows={tokenBasedRows}
              initialSortedColumnKey="amount"
              renderRow={renderRow}
              secondPassSortFunction={secondPassSortFunction}
            />
          </BlurryBackdropBox>
        )}

        {pointBasedRows.length > 0 && (
          <BlurryBackdropBox>
            <StyledTable
              columns={pointBasedColumns}
              rows={pointBasedRows}
              initialSortedColumnKey="amount"
              renderRow={renderRow}
              secondPassSortFunction={secondPassSortFunction}
            />
          </BlurryBackdropBox>
        )}
      </ContentContainer>
    </>
  )
}
