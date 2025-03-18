"use client"

import { buildColumns } from "@/components/BidsTable/buildColumns"
import { buildRow } from "@/components/BidsTable/buildRow"
import { RowComponent } from "@/components/BidsTable/renderRow"
import { BlurryBackdropBox } from "@/components/BlurryBackdropBox"
import { CollapsibleBox } from "@/components/CollapsibleBox"
import { Icon } from "@/components/Icon"
import { StyledTable } from "@/components/StyledTable"
import { StyledText } from "@/components/StyledText"
import { useBackendData } from "@/contract-apis/useBackendData"
import { pluralize } from "@/lib/pluralize"
import { useMemo, useState } from "react"
import { twJoin } from "tailwind-merge"
import { useCopyToClipboard } from "usehooks-ts"

export function BidsTable({ trancheId }: { trancheId: number }) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const tableId = `bids-table-${trancheId}`

  const [copiedText, copyToClipboard] = useCopyToClipboard()
  const [hasCopied, setHasCopied] = useState(false)

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

  const handleCopyLink = () => {
    const tableUrl = new URL(`#${tableId}`, window.location.href)
    copyToClipboard(tableUrl.toString())
    setHasCopied(true)
    setTimeout(() => {
      setHasCopied(false)
    }, 2000)
  }

  return (
    <BlurryBackdropBox
      id={tableId}
      key={trancheId}
      className="group flex flex-col gap-3"
    >
      <div
        className={twJoin(
          "flex items-center justify-between",
          "rounded-t-md bg-palette-beige/20",
          "-mx-2 -my-1 px-6 py-3",
          "transition-all",
          "group-has-[[data-collapsed]]:rounded-b-md"
        )}
      >
        <StyledText variant="h4">
          {tranche?.name ?? <em>(Unnamed Tranche)</em>}
        </StyledText>

        <div className="flex flex-row-reverse items-center gap-6 text-xs">
          <StyledText
            as="button"
            variant="button.secondary.small"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            <Icon name={isCollapsed ? "square-plus" : "square-minus"} />
            <span>{isCollapsed ? "Expand" : "Collapse"}</span>
          </StyledText>

          <StyledText
            as="button"
            variant={hasCopied ? undefined : "link"}
            className="inline-flex items-center gap-1"
            onClick={handleCopyLink}
          >
            <Icon name={hasCopied ? "solid:check" : "solid:link"} />
            <span>{hasCopied ? "Copied!" : "Copy Link"}</span>
          </StyledText>
        </div>
      </div>

      <CollapsibleBox
        isCollapsed={!isCollapsed}
        className="[&[data-collapsed]]:opacity-0"
      >
        <StyledText
          variant="footnote"
          className={twJoin("block text-center", "pb-1 pt-3")}
        >
          <StyledText
            as="button"
            variant="link"
            className="inline-flex items-center gap-0.5"
            onClick={() => setIsCollapsed(false)}
          >
            <Icon name="square-plus" />
            <span>Expand</span>
          </StyledText>{" "}
          {pluralize({
            count: rowsInTranche.length,
            singular: "Bid",
            prefixCount: true,
          })}
        </StyledText>
      </CollapsibleBox>

      <CollapsibleBox
        isCollapsed={isCollapsed}
        className="[&[data-collapsed]]:opacity-0"
      >
        <StyledTable
          initialSortedColumnKey="currentVoteShare"
          columns={columns}
          rows={rowsInTranche}
          renderRow={(props) => (
            <RowComponent key={props.row._bid.id} {...props} />
          )}
        />
      </CollapsibleBox>
    </BlurryBackdropBox>
  )
}
