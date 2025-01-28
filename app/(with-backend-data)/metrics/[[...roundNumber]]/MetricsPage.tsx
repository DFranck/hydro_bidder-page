"use client"

import { AmountAndUnitPair } from "@/components/AmountAndUnitPair"
import { BidTributes } from "@/components/BidTributes"
import { BlurryBackdropBox } from "@/components/BlurryBackdropBox"
import { ContentContainer } from "@/components/ContentContainer"
import { Icon } from "@/components/Icon"
import { InvisibleLink } from "@/components/InvisibleLink"
import { StatCards } from "@/components/StatCards"
import { StyledTable, TD, TR } from "@/components/StyledTable"
import { ColumnObject, RowRenderFunction } from "@/components/StyledTable/types"
import { StyledText } from "@/components/StyledText"
import { Tooltip } from "@/components/Tooltip"
import {
  metricsDurationColumnTooltip,
  metricsPolRewardsColumnTooltip,
  metricsPolSizeColumnTooltip,
  metricsStatusColumnTooltip,
  metricsTributeColumnTooltip,
  VOTE_SHARE_THRESHOLD,
  voteThresholdTooltip,
} from "@/components/ToolTips"
import { useBackendData } from "@/contract-apis/useBackendData"
import { pluralize } from "@/lib/pluralize"
import { max, sumBy, uniq } from "lodash"
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
  const { bidsById, metricsForPreHydroBids, metricsForPostHydroBids } =
    useBackendData()

  const postHydroRoundIdsWithBidData = uniq(
    metricsForPostHydroBids.map((bid) => Number(bid.roundId))
  )

  const highestRoundId = max(postHydroRoundIdsWithBidData) ?? PRE_HYDRO_ROUND_ID

  const requestedRoundId =
    requestedRoundNumber === null
      ? highestRoundId
      : typeof requestedRoundNumber === "number" && requestedRoundNumber >= 1
        ? Math.min(requestedRoundNumber - 1, highestRoundId)
        : PRE_HYDRO_ROUND_ID

  const bidsToRender =
    requestedRoundId === PRE_HYDRO_ROUND_ID
      ? metricsForPreHydroBids
      : metricsForPostHydroBids.filter(
          (bid) => bid.roundId === requestedRoundId
        )

  const rows = bidsToRender.map((bid) => {
    const {
      apr,
      id,
      currentAllocationAmount,
      durationDays,
      initialAllocationAmount,
      projectLogoUrl,
      projectName,
      status,
      title,
    } = bid

    const bidFromContract = bidsById[Number(id)] ?? null

    const rowURL =
      requestedRoundId === PRE_HYDRO_ROUND_ID
        ? `https://www.mintscan.io/cosmos/proposals/${id.replace("#", "")}`
        : `/bids/${id}`

    const percentage = bidFromContract?.percentage ?? null

    const isPending =
      status.toLowerCase() === "voting period" ||
      (status.toLowerCase() === "ongoing" &&
        (apr === 0 || currentAllocationAmount - initialAllocationAmount <= 0))

    return {
      _bid: { ...bid, percentage },

      logoAndTitle: (
        <InvisibleLink href={rowURL} className="flex items-center gap-6">
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

          <div className="flex flex-col">
            <StyledText variant="h4">{title}</StyledText>
            <StyledText variant="footnote">{projectName}</StyledText>
          </div>
        </InvisibleLink>
      ),

      polSize: (
        <InvisibleLink href={rowURL}>
          {!!currentAllocationAmount && (
            <AmountAndUnitPair
              amount={currentAllocationAmount.toLocaleString(undefined, {
                maximumFractionDigits: 4,
              })}
              unit="ATOM"
            />
          )}
        </InvisibleLink>
      ),

      duration: (
        <InvisibleLink href={rowURL}>
          {!durationDays
            ? "Pending"
            : durationDays < 30
              ? pluralize({
                  count: durationDays,
                  prefixCount: true,
                  singular: "day",
                })
              : pluralize({
                  count: Math.round(durationDays / 30),
                  prefixCount: true,
                  singular: "month",
                })}
        </InvisibleLink>
      ),

      polApr: (
        <InvisibleLink href={rowURL}>
          <Tooltip
            tipContents={
              isPending
                ? "No rewards yet — still pending"
                : "currentAllocationAmount" in bid &&
                  "initialAllocationAmount" in bid && (
                    <div className="flex items-center justify-between gap-6">
                      <StyledText variant="label">PoL Rewards</StyledText>
                      <AmountAndUnitPair
                        amount={(
                          currentAllocationAmount - initialAllocationAmount
                        ).toLocaleString(undefined, {
                          maximumFractionDigits: 4,
                        })}
                        unit="ATOM"
                        textAlign="right"
                      />
                    </div>
                  )
            }
            className={twJoin(
              "inline-flex items-center gap-1",
              "border-b-2 border-dotted border-white/50 hover:border-white"
            )}
            classNamesForTooltip="w-fit"
          >
            <span>{bid.apr}%</span>
          </Tooltip>
        </InvisibleLink>
      ),

      tributeApr: (
        <InvisibleLink href={rowURL}>
          {bidFromContract ? (
            <Tooltip
              tipContents={
                <div className="flex items-center justify-between gap-6">
                  <StyledText variant="label">Tribute Size</StyledText>
                  <BidTributes bid={bidFromContract} textAlign="right" />
                </div>
              }
              className={twJoin(
                "inline-flex items-center gap-1",
                "border-b-2 border-dotted border-white/50 hover:border-white"
              )}
              classNamesForTooltip="w-fit"
            >
              <span>{(bidFromContract.tributeApr * 100).toFixed(2)}%</span>
            </Tooltip>
          ) : (
            0
          )}
        </InvisibleLink>
      ),

      status: <InvisibleLink href={rowURL}>{status}</InvisibleLink>,
    }
  })

  type Row = (typeof rows)[number]

  const columns: ColumnObject<Row, keyof Row>[] = [
    {
      key: "logoAndTitle",
      label: "Bid Title / Project Name",
      isSortable: true,
      initialSortDirection: "ASC",
      customValueGetter: (row) => row._bid.title,
    },
    {
      key: "polSize",
      label: (
        <Tooltip tipContents={metricsPolSizeColumnTooltip}>
          <div className="flex items-center gap-1">
            PoL Size
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
      customValueGetter: (row) =>
        "initialAllocationAmount" in row._bid
          ? row._bid.initialAllocationAmount
          : 0,
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
          tipContents={metricsTributeColumnTooltip}
          classNamesForTooltip="-ml-12"
        >
          <div className="flex items-center gap-1">
            Tribute APR
            <Icon name="circle-info" />
          </div>
        </Tooltip>
      ),
      textAlign: "right",
      isSortable: true,
      initialSortDirection: "DESC",
      customValueGetter: (row) =>
        row._bid.onchainTributeUsdc ||
        sumBy(row._bid.offchainTribute, "amount"),
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
      customValueGetter: (row) => ("status" in row._bid ? row._bid.status : ""),
    },
  ]

  const renderRow = useCallback<RowRenderFunction<Row, keyof Row>>(
    ({ children, row, rowProps }) => {
      const shouldShowVoteThresholdLine =
        row._bid.percentage !== null &&
        row._bid.percentage < VOTE_SHARE_THRESHOLD

      return (
        <Fragment key={row._bid.id}>
          {!!shouldShowVoteThresholdLine && (
            <TR
              className="
                js-vote-threshold-line
                [&~&]:hidden
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
      {process.env.CONTEXT !== "production" && (
        <StatCards>
          <StatCards.CurrentRoundPoLAvailable />
          <StatCards.AllTimePoLDeployed />
          <StatCards.AllTimePoLRevenue />
        </StatCards>
      )}

      <ContentContainer className="gap-6 py-6">
        <div className="flex items-center justify-between">
          <h2 className="sr-only">PoL Metrics by Round</h2>

          <div>
            <StyledText as="p" variant="footnote">
              Metrics are updated at the end of each round.
            </StyledText>
          </div>

          <div className="flex items-center backdrop-blur-sm">
            {[PRE_HYDRO_ROUND_ID, ...postHydroRoundIdsWithBidData.sort()].map(
              (roundId) => {
                const isActive = roundId === requestedRoundId

                return (
                  <StyledText
                    as={Link}
                    variant={isActive ? "button.primary" : "button.secondary"}
                    href={`/metrics/${roundId + 1}`}
                    key={roundId}
                    className={twMerge(
                      `
                        -mx-px
                        rounded-none
                        backdrop-blur-none
                        first:rounded-l-full
                        last:rounded-r-full
                        hover:scale-100
                      `,
                      !isActive &&
                        `
                          text-palette-green/50
                          hover:text-palette-green
                        `
                    )}
                  >
                    {roundId === -1 ? "Pre-Hydro" : `Round ${roundId + 1}`}
                  </StyledText>
                )
              }
            )}
          </div>
        </div>

        <BlurryBackdropBox>
          <StyledTable
            columns={columns}
            rows={rows}
            initialSortedColumnKey="polSize"
            renderRow={renderRow}
            secondSortRows={(sortedRows) =>
              [...sortedRows].sort((a, b) => {
                const aExceedsThreshold =
                  a._bid.percentage && a._bid.percentage >= VOTE_SHARE_THRESHOLD
                const bExceedsThreshold =
                  b._bid.percentage && b._bid.percentage >= VOTE_SHARE_THRESHOLD
                return Number(bExceedsThreshold) - Number(aExceedsThreshold)
              })
            }
          />
        </BlurryBackdropBox>
      </ContentContainer>
    </>
  )
}
