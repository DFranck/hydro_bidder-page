"use client"

import { buildColumns } from "@/components/BidsTable/buildColumns"
import { buildRow } from "@/components/BidsTable/buildRow"
import { RowComponent } from "@/components/BidsTable/renderRow"
import { CollapsibleTable } from "@/components/CollapsibleTable"
import { StyledTable } from "@/components/StyledTable"
import { useBackendData } from "@/contract-apis/useBackendData"
import { useMemo } from "react"

export function BidsTable({ trancheId }: { trancheId: number }) {
  const tableId = `bids-table-${trancheId}`

  const {
    tranches,
    bidsInfo,
    bidMetaDataById,
    currentRoundId,
    votesByRoundId,
  } = useBackendData()

  const bidsInRound = Object.values(bidsInfo).filter(
    (bid) => bid.roundId === currentRoundId
  )

  const tranche = tranches.find((t) => t.id === trancheId)

  const bidsInTranche = bidsInRound.filter((bid) => bid.trancheId === trancheId)

  const rowsInTranche = useMemo(() => {
    return bidsInTranche.map((bid) => buildRow(bid))
  }, [bidsInTranche])

  type Row = (typeof rowsInTranche)[number]

  const columns = useMemo(() => {
    return buildColumns<Row>()
  }, [bidsInfo, bidMetaDataById, currentRoundId, votesByRoundId])

  return (
    <CollapsibleTable
      id={tableId}
      title={tranche?.name ?? <em>(Unnamed Tranche)</em>}
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
