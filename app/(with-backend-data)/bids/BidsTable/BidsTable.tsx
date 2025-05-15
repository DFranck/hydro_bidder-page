"use client"

import { CollapsibleTable } from "@/components/CollapsibleTable"
import { StyledTable } from "@/components/StyledTable"
import { TrancheTitle } from "@/components/TrancheTitle"
import { useBackendData } from "@/contract-apis/useBackendData"
import { useMemo, useState } from "react"
import { buildColumns } from "./buildColumns"
import { buildRow } from "./buildRow"
import { RowComponent } from "./RowComponent"

export function BidsTable({ trancheId }: { trancheId: number }) {
  const [showBidsWithoutTributes, setShowBidsWithoutTributes] = useState(false)
  const tableId = `bids-table-${trancheId}`

  const { bidsInfo, currentRoundId, tranches } = useBackendData()
  const tranche = tranches.find((t) => t.id === trancheId)

  const rowsInTranche = useMemo(() => {
    const bidsInRound = Object.values(bidsInfo).filter(
      (bid) => bid.roundId === currentRoundId
    )

    const bidsInTranche = bidsInRound.filter(
      (bid) => bid.trancheId === trancheId
    )

    const filteredBidsInTranche = bidsInTranche.filter((bid) => {
      if (showBidsWithoutTributes) {
        return true
      }

      if (bid.points && bid.points.length > 0) {
        return true
      }

      if (bid.tokenBasedTributes.length === 0) {
        return false
      }

      return true
    })

    const trancheMetadata = (() => {
      try {
        return JSON.parse(String(tranche?.metadata)) as {
          pool_sizes: { round_id: number; amount: number; denom: string }[]
        }
      } catch {
        return null
      }
    })()

    const currentRoundPoolSize = trancheMetadata
      ? trancheMetadata.pool_sizes?.find((x) => x.round_id === currentRoundId)
      : undefined

    return filteredBidsInTranche.map((bid) =>
      buildRow({
        bid,
        totalLiquidityForCurrentRound: currentRoundPoolSize?.amount,
        denom: currentRoundPoolSize?.denom || "",
      })
    )
  }, [bidsInfo, currentRoundId, trancheId, showBidsWithoutTributes])

  type Row = (typeof rowsInTranche)[number]

  const columns = useMemo(() => {
    return buildColumns<Row>()
  }, [])

  return (
    <CollapsibleTable
      id={tableId}
      title={<TrancheTitle trancheId={trancheId} roundId={currentRoundId} />}
      numRows={rowsInTranche.length}
      showBidsWithoutTributes={showBidsWithoutTributes}
      setShowBidsWithoutTributes={setShowBidsWithoutTributes}
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
