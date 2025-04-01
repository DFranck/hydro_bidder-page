"use client"

import { CollapsibleTable } from "@/components/CollapsibleTable"
import { StyledTable, TD, TR } from "@/components/StyledTable"
import { useBackendData } from "@/contract-apis/useBackendData"
import { Fragment, useCallback, useMemo } from "react"
import { buildColumns } from "./buildColumns"
import { MetricsRow, PRE_HYDRO_ROUND_ID } from "./MetricsPage"
import { RowRenderFunction } from "@/components/StyledTable/types"
import { Tooltip } from "@/components/Tooltip"
import {
  voteThresholdTooltip,
} from "@/components/ToolTips"
import { Icon } from "@/components/Icon"
import { max, uniq } from "lodash"
import { buildRow } from "./buildRow"
import {
  AugmentedBidFromNumiaSlimmed,
  BidRevampMetrics,
} from "@/contract-apis/types"
import { VOTE_SHARE_THRESHOLD } from "@/config"

export function MetricsTable({
  trancheId,
  requestedRoundNumber,
}: {
  trancheId: number
  requestedRoundNumber: number | null
}) {
  const {
    tranches,
    bidsInfo,
    currentRoundId,
    metricsForPreHydroBids,
    bidMetaDataById,
  } = useBackendData()

  const tableId = `metrics-table-${trancheId}`
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

  const tranche = tranches.find((t) => t.id === trancheId)

  const rowsInTranche = useMemo(() => {
    const bidsToRender = requestedPreHydro
      ? metricsForPreHydroBids
      : bids.filter((bid) => bid.roundId === requestedRoundId)

    const bidsInTranche = bidsToRender.filter((bid) => {
      if (requestedPreHydro) {
        return (bid as AugmentedBidFromNumiaSlimmed).tranche === trancheId
      }
      return (bid as BidRevampMetrics).trancheId === trancheId
    })

    return bidsInTranche.map((bid) => {
      const bidMetaData = bidMetaDataById[Number(bid.id)] ?? null
      const bidFromContract = bidsInfo[Number(bid.id)] ?? null
      return buildRow(bid, bidMetaData, bidFromContract, requestedPreHydro)
    })
  }, [bidsInfo, currentRoundId, trancheId])

  const columns = useMemo(() => {
    return buildColumns(requestedPreHydro, currentRoundId, requestedRoundId)
  }, [])

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
    <CollapsibleTable
      id={tableId}
      title={tranche?.name ?? <em>(Unnamed Tranche)</em>}
      numRows={rowsInTranche.length}
    >
      <StyledTable
        initialSortedColumnKey="amount"
        columns={columns}
        rows={rowsInTranche}
        renderRow={renderRow}
        secondPassSortFunction={secondPassSortFunction}
      />
    </CollapsibleTable>
  )
}
