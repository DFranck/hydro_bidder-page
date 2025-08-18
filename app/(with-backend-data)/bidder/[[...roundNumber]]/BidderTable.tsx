"use client"

import { CollapsibleTable } from "@/components/CollapsibleTable"
import { StyledTable } from "@/components/StyledTable"
import { RowRenderFunction } from "@/components/StyledTable/types"
import { voteThresholdTooltip } from "@/components/ToolTips"
import { TrancheTitle } from "@/components/TrancheTitle"
import { voteThresholdByTrancheId } from "@/config"
import { BidRevampMetrics } from "@/contract-apis/types"
import { useBackendData } from "@/contract-apis/useBackendData"
import max from "lodash/max"
import uniq from "lodash/uniq"
import { useCallback, useMemo, useState } from "react"
import { BidderRow, PRE_HYDRO_ROUND_ID } from "./BidderPage"
import { buildColumns } from "./buildColumns"
import { buildRow } from "./buildRow"
import { RowComponent } from "./RowComponent"

export function BidderTable({
  trancheId,
  requestedRoundNumber,
}: {
  trancheId: number
  requestedRoundNumber: number | null
}) {
  const [showBidsWithoutTributes, setShowBidsWithoutTributes] = useState(false)
  const { bidsInfo, currentRoundId, metricsForPreHydroBids } = useBackendData()

  const voteThreshold =
    voteThresholdByTrancheId[trancheId as keyof typeof voteThresholdByTrancheId]

  const tableId = `bidder-table-${trancheId}`
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

  const rowsInTranche = useMemo(() => {
    const bidsToRender = requestedPreHydro
      ? metricsForPreHydroBids
      : bids.filter((bid) => bid.roundId === requestedRoundId)

    const bidsInTranche = requestedPreHydro
      ? bidsToRender
      : bidsToRender.filter((bid) => {
          return (bid as BidRevampMetrics).trancheId === trancheId
        })

    const filteredBidsInTranche = bidsInTranche.filter((x) => {
      if (requestedPreHydro || showBidsWithoutTributes) {
        return true
      }

      const bid = x as BidRevampMetrics
      const hasPoints = bid.points?.length > 0
      const hasTokenTributes = bid.tokenBasedTributes.length > 0
      return hasPoints || hasTokenTributes
    })

    return filteredBidsInTranche.map((bid) => {
      return buildRow(bid, requestedPreHydro)
    })
  }, [bidsInfo, currentRoundId, trancheId, showBidsWithoutTributes])

  const columns = useMemo(() => {
    return buildColumns(requestedPreHydro, currentRoundId, requestedRoundId)
  }, [requestedPreHydro, currentRoundId, requestedRoundId])

  function secondPassSortFunction(sortedRows: BidderRow[]) {
    return [...sortedRows].sort((a, b) => {
      if (requestedPreHydro) {
        return 0
      }
      const aExceedsThreshold =
        (a._bid as BidRevampMetrics).vote_perc &&
        (a._bid as BidRevampMetrics).vote_perc >= voteThreshold
      const bExceedsThreshold =
        (b._bid as BidRevampMetrics).vote_perc &&
        (b._bid as BidRevampMetrics).vote_perc >= voteThreshold
      return Number(bExceedsThreshold) - Number(aExceedsThreshold)
    })
  }

  const renderRow = useCallback<
    RowRenderFunction<BidderRow, keyof BidderRow>
  >(
    ({
      children,
      row,
      rowProps,
      rowIndex,
      sortDirection,
      sortedColumnKey,
      sortedRows,
    }) => (
      <RowComponent
        key={`metric_row_${row._bid.id}_${rowIndex}`}
        requestedPreHydro={requestedPreHydro}
        voteThreshold={voteThreshold}
        trancheId={trancheId}
        row={row as any}
        rowIndex={rowIndex}
        sortDirection={sortDirection}
        sortedColumnKey={sortedColumnKey}
        sortedRows={sortedRows}
        rowProps={rowProps}
      >
        {children}
      </RowComponent>
    ),
    [voteThresholdTooltip]
  )

  return (
    <CollapsibleTable
      id={tableId}
      title={<TrancheTitle trancheId={trancheId} roundId={requestedRoundId} />}
      numRows={rowsInTranche.length}
      showBidsWithoutTributes={showBidsWithoutTributes}
      setShowBidsWithoutTributes={setShowBidsWithoutTributes}
    >
      <StyledTable
        initialSortedColumnKey="status"
        columns={columns}
        rows={rowsInTranche}
        renderRow={renderRow}
        secondPassSortFunction={secondPassSortFunction}
      />
    </CollapsibleTable>
  )
}
