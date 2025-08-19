
"use client"

import { CollapsibleTable } from "@/components/CollapsibleTable"
import { StyledTable } from "@/components/StyledTable"
import { ColumnObject, RowRenderFunction } from "@/components/StyledTable/types"
import { TrancheTitle } from "@/components/TrancheTitle"
import { BidRevampMetrics } from "@/contract-apis/types"
import { useBackendData } from "@/contract-apis/useBackendData"
import max from "lodash/max"
import uniq from "lodash/uniq"
import { useCallback, useMemo, useState } from "react"
import { BidderRow, PRE_HYDRO_ROUND_ID } from "./BidderPage"
import { BidderTableItem } from "./BidderTableItem"
import { buildColumns } from "./buildColumns"
import { buildRow } from "./buildRow"

export function BidderTable({
  trancheId,
  requestedRoundNumber,
}: {
  trancheId: number
  requestedRoundNumber: number | null
}) {
  const [showBidsWithoutTributes, setShowBidsWithoutTributes] = useState(false)
  const [openedRows, setOpenedRows] = useState<Array<string | number>>([])

  const { bidsInfo, currentRoundId, metricsForPreHydroBids } = useBackendData()

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

 const rowsInTranche = useMemo<BidderRow[]>(() => {
  const bidsToRender = requestedPreHydro
    ? metricsForPreHydroBids
    : bids.filter((bid) => bid.roundId === requestedRoundId)

  const bidsInTranche = requestedPreHydro
    ? bidsToRender
    : bidsToRender.filter((bid) => (bid as BidRevampMetrics).trancheId === trancheId)

  const filtered = bidsInTranche.filter((x) => {
    if (requestedPreHydro || showBidsWithoutTributes) return true
    const bid = x as BidRevampMetrics
    const hasPoints = bid.points?.length > 0
    const hasTokenTributes = bid.tokenBasedTributes.length > 0
    return hasPoints || hasTokenTributes
  })

  return filtered.map((bid) => {
    const base = buildRow(bid, requestedPreHydro)

    if (requestedPreHydro) {
      // Pre-hydro : pas de tributes
      return { ...base, tributeCount: 0, tributeUsdTotal: 0 }
    }

    const b = bid as BidRevampMetrics
    const tributeCount = b.tokenBasedTributes?.length ?? 0

    return { ...base, tributeCount }
  })
}, [
  bidsInfo,
  currentRoundId,
  trancheId,
  showBidsWithoutTributes,
  requestedPreHydro,
  requestedRoundId,
])


  const columns = useMemo<ColumnObject<BidderRow, keyof BidderRow>[]>(() => {
    return buildColumns(requestedPreHydro, currentRoundId, requestedRoundId)
  }, [requestedPreHydro, currentRoundId, requestedRoundId])

  const toggleRow = (bidId: string | number) => {
    setOpenedRows((prev) =>
      prev.includes(bidId) ? prev.filter((id) => id !== bidId) : [...prev, bidId]
    )
  }

  const renderRow = useCallback<
    RowRenderFunction<BidderRow, keyof BidderRow>
  >(
    (props) => {
      const bidId = (props.row._bid as any).id as string | number
      const isOpened = openedRows.includes(bidId)
      const canOpen = props.row.hasTributes
      return (
        <BidderTableItem
          key={`bidder_row_${bidId}_${props.rowIndex}`}
          {...props}
          isOpened={isOpened}
          canOpen={canOpen}
          onToggle={toggleRow}
        />
      )
    },
    [openedRows]
  )

  const secondPassSortFunction = (sortedRows: BidderRow[]) => sortedRows

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
