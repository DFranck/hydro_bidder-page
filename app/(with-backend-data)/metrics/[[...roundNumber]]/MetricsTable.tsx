"use client"

import { CollapsibleTable } from "@/components/CollapsibleTable"
import { StyledTable } from "@/components/StyledTable"
import { RowRenderFunction } from "@/components/StyledTable/types"
import { voteThresholdTooltip } from "@/components/ToolTips"
import { TrancheTitle } from "@/components/TrancheTitle"
import { voteThresholdByTrancheId } from "@/config"
import {
  AugmentedBidFromNumiaSlimmed,
  BidRevampMetrics,
} from "@/contract-apis/types"
import { useBackendData } from "@/contract-apis/useBackendData"
import max from "lodash/max"
import uniq from "lodash/uniq"
import { useCallback, useMemo } from "react"
import { buildColumns } from "./buildColumns"
import { buildRow } from "./buildRow"
import { MetricsRow, PRE_HYDRO_ROUND_ID } from "./MetricsPage"
import { RowComponent } from "./RowComponent"

export function MetricsTable({
  trancheId,
  requestedRoundNumber,
}: {
  trancheId: number
  requestedRoundNumber: number | null
}) {
  const { bidsInfo, currentRoundId, metricsForPreHydroBids, bidMetaDataById } =
    useBackendData()

  const voteThreshold =
    voteThresholdByTrancheId[trancheId as keyof typeof voteThresholdByTrancheId]

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
  }, [requestedPreHydro, currentRoundId, requestedRoundId])

  function secondPassSortFunction(sortedRows: MetricsRow[]) {
    return [...sortedRows].sort((a, b) => {
      if (requestedPreHydro) {
        return 0
      }
      const aExceedsThreshold =
        a._bidFromContract.vote_perc &&
        a._bidFromContract.vote_perc >= voteThreshold
      const bExceedsThreshold =
        b._bidFromContract.vote_perc &&
        b._bidFromContract.vote_perc >= voteThreshold
      return Number(bExceedsThreshold) - Number(aExceedsThreshold)
    })
  }

  const renderRow = useCallback<
    RowRenderFunction<MetricsRow, keyof MetricsRow>
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
