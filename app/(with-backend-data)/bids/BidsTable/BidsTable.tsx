"use client"

import { CollapsibleTable } from "@/components/CollapsibleTable"
import { StyledTable } from "@/components/StyledTable"
import { TrancheTitle } from "@/components/TrancheTitle"
import { useBackendData } from "@/contract-apis/useBackendData"
import { useMemo } from "react"
import { buildColumns } from "./buildColumns"
import { buildRow } from "./buildRow"
import { RowComponent } from "./RowComponent"

export function BidsTable({ trancheId }: { trancheId: number }) {
  const tableId = `bids-table-${trancheId}`

  const { bidsInfo, currentRoundId } = useBackendData()

  const rowsInTranche = useMemo(() => {
    const bidsInRound = Object.values(bidsInfo).filter(
      (bid) => bid.roundId === currentRoundId,
    )

    const bidsInTranche = bidsInRound.filter(
      (bid) => bid.trancheId === trancheId,
    )
    return bidsInTranche.map((bid) => buildRow({ bid }))
  }, [bidsInfo, currentRoundId, trancheId])

  type Row = (typeof rowsInTranche)[number]

  const columns = useMemo(() => {
    return buildColumns<Row>()
  }, [])

  return (
    <CollapsibleTable
      id={tableId}
      title={<TrancheTitle trancheId={trancheId} />}
      numRows={rowsInTranche.length}
    >
      <StyledTable
        initialSortedColumnKey="currentVoteShare"
        columns={columns}
        rows={rowsInTranche}
        renderRow={(props) => (
          <RowComponent key={props.row._bid.id} {...props} />
        )}
      />
    </CollapsibleTable>
  )
}
