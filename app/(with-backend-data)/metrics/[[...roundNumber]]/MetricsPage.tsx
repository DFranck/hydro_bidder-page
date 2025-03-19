"use client"

import { ConditionalWrapper } from "@/components/ConditionalWrapper"
import { ContentContainer } from "@/components/ContentContainer"
import { Icon } from "@/components/Icon"
import { StatCards } from "@/components/StatCards"
import { StyledTable, TD, TR } from "@/components/StyledTable"
import { RowRenderFunction } from "@/components/StyledTable/types"
import { StyledText } from "@/components/StyledText"
import { Tooltip } from "@/components/Tooltip"
import {
  metricsPageNoDataTooltip,
  VOTE_SHARE_THRESHOLD,
  voteThresholdTooltip,
} from "@/components/ToolTips"
import {
  AugmentedBidFromNumiaSlimmed,
  BidMetaDataSlimmed,
  BidRevampMetrics,
} from "@/contract-apis/types"
import { useBackendData } from "@/contract-apis/useBackendData"
import max from "lodash/max"
import range from "lodash/range"
import uniq from "lodash/uniq"
import Link from "next/link"
import { Fragment, ReactNode, useCallback, useMemo } from "react"
import { twJoin, twMerge } from "tailwind-merge"
import { getMetricsTableColumns } from "./getMetricsTableColumns"
import { getMetricsTableRows } from "./getMetricsTableRows"
import { groupBy, mapValues } from "lodash"
import { CollapsibleTable } from "@/components/CollapsibleTable"

const PRE_HYDRO_ROUND_ID = -1

export interface MetricsRow {
  _bid: BidRevampMetrics | AugmentedBidFromNumiaSlimmed
  _bidFromContract: BidRevampMetrics
  _bidMetaData: BidMetaDataSlimmed
  logoAndTitle: ReactNode
  amount: ReactNode
  duration: ReactNode
  polApr: ReactNode
  tributeApr: ReactNode
  status: ReactNode
}

export function MetricsPage({
  requestedRoundNumber,
}: {
  requestedRoundNumber: number | null
}) {
  const {
    bidsInfo,
    bidMetaDataById,
    currentRoundId,
    metricsForPreHydroBids,
    tranches,
  } = useBackendData()

  const bids = Object.values(bidsInfo)

  const postHydroRoundIdsWithBidData = uniq(bids.map((bid) => bid.roundId))

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
    : bids.filter((bid) => bid.roundId === requestedRoundId)

  const bidsByTrancheId = useMemo(
    () => groupBy(bidsToRender, "trancheId"),
    [bidsToRender]
  )

  const metricTableColumns = getMetricsTableColumns(
    requestedPreHydro,
    currentRoundId,
    requestedRoundId
  )

  const metricRowsByTrancheId = useMemo(
    () =>
      mapValues(bidsByTrancheId, (bidsInTranche) =>
        getMetricsTableRows(
          (bidsInTranche as
            | AugmentedBidFromNumiaSlimmed[]
            | BidRevampMetrics[]) || [],
          bidsInfo,
          bidMetaDataById,
          requestedPreHydro
        )
      ),
    [bidsByTrancheId]
  )

  function secondPassSortFunction(sortedRows: MetricsRow[]) {
    return [...sortedRows].sort((a, b) => {
      if (requestedPreHydro) {
        return 0
      }
      const aExceedsThreshold =
        a._bidFromContract.vote_perc &&
        a._bidFromContract.vote_perc * 100 >= VOTE_SHARE_THRESHOLD
      const bExceedsThreshold =
        b._bidFromContract.vote_perc &&
        b._bidFromContract.vote_perc * 100 >= VOTE_SHARE_THRESHOLD
      return Number(bExceedsThreshold) - Number(aExceedsThreshold)
    })
  }

  const renderRow = useCallback<
    RowRenderFunction<MetricsRow, keyof MetricsRow>
  >(
    ({ children, row, rowProps }) => {
      const shouldShowVoteThresholdLine =
        !requestedPreHydro &&
        row._bidFromContract.vote_perc !== null &&
        row._bidFromContract.vote_perc * 100 < VOTE_SHARE_THRESHOLD

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
          data-testid="metrics-page-round-navigation"
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
        {Object.entries(metricRowsByTrancheId).map(
          ([trancheId, metricRowsInTranche]) => {
            const tranche = tranches.find((t) => t.id === Number(trancheId))
            const tableId = `metrics-table-${trancheId}`
            return (
              <CollapsibleTable
                key={tableId}
                id={tableId}
                title={tranche?.name ?? <em>(Unnamed Tranche)</em>}
                numRows={metricRowsInTranche.length}
              >
                <StyledTable
                  initialSortedColumnKey="amount"
                  columns={metricTableColumns}
                  rows={metricRowsInTranche}
                  renderRow={renderRow}
                  secondPassSortFunction={secondPassSortFunction}
                />
              </CollapsibleTable>
            )
          }
        )}
      </ContentContainer>
    </>
  )
}
