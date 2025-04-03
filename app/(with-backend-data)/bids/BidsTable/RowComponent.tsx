import { Icon } from "@/components/Icon"
import { TD, TR } from "@/components/StyledTable"
import { BaseRowObject, RowRenderProps } from "@/components/StyledTable/types"
import { Tooltip } from "@/components/Tooltip"
import { voteThresholdTooltip } from "@/components/ToolTips"
import { voteThresholdByTrancheId } from "@/config"
import { BidRevampMetrics } from "@/contract-apis/types"
import { useBackendData } from "@/contract-apis/useBackendData"
import { Fragment } from "react"
import { classNames } from "./classNames"

export function RowComponent<
  Row extends BaseRowObject & {
    _bid: BidRevampMetrics
  },
>({
  children,
  row,
  rowProps,
  sortDirection,
  sortedColumnKey,
}: RowRenderProps<Row, keyof Row>) {
  const { currentRoundId, votesByRoundId } = useBackendData()

  const voteThreshold =
    voteThresholdByTrancheId[
      row._bid.trancheId as keyof typeof voteThresholdByTrancheId
    ]

  const shouldShowVoteThresholdLine =
    sortedColumnKey === "currentVoteShare" &&
    sortDirection === "DESC" &&
    row._bid.vote_perc < voteThreshold

  const votesThisRound = votesByRoundId[currentRoundId] ?? []

  const userVotedForBid = votesThisRound.some(
    (vote) => vote.bidId === row._bid.id
  )

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

              <Tooltip
                tipContents={voteThresholdTooltip({
                  trancheId: row._bid.trancheId,
                })}
              >
                <div className="flex items-center gap-1">
                  <Icon name="solid:circle" />
                  <span>
                    These bids are below the{" "}
                    <strong>{voteThreshold * 100}% vote share threshold</strong>
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
      <TR
        className={userVotedForBid ? classNames.hasVotedRow : undefined}
        key={row._bid.id}
        {...rowProps}
      >
        {children}
      </TR>
    </Fragment>
  )
}
