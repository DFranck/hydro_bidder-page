import { Icon } from "@/components/Icon"
import { TD, TR } from "@/components/StyledTable"
import { BaseRowObject, RowRenderProps } from "@/components/StyledTable/types"
import { Tooltip } from "@/components/Tooltip"
import { voteThresholdTooltip } from "@/components/ToolTips"
import { BidRevampMetrics } from "@/contract-apis/types"
import { Fragment } from "react"
import { twJoin, twMerge } from "tailwind-merge"

export function RowComponent<
  Row extends BaseRowObject & {
    _bid: BidRevampMetrics
  },
>({
  children,
  requestedPreHydro,
  row,
  rowIndex,
  rowProps,
  sortDirection,
  sortedColumnKey,
  trancheId,
  voteThreshold,
}: RowRenderProps<Row, keyof Row> & {
  requestedPreHydro: boolean
  voteThreshold: number
  trancheId: number
}) {
  const shouldShowVoteThresholdLine =
    !requestedPreHydro &&
    sortDirection === "DESC" &&
    sortedColumnKey === "tributeApr" &&
    row._bid.vote_perc !== null &&
    row._bid.vote_perc < voteThreshold

  return (
    <Fragment key={row._bid.id}>
      {!!shouldShowVoteThresholdLine && (
        <TR className="js-vote-threshold-line bg-none [&~&]:hidden">
          <TD colSpan={99} className="p-0!">
            <div
              className={twJoin(
                "flex items-center justify-between gap-3",
                "text-palette-beige text-xs whitespace-nowrap"
              )}
            >
              <div className="border-palette-beige w-full border-t-2" />

              <Tooltip tipContents={voteThresholdTooltip({ trancheId })}>
                <div className="flex items-center gap-1">
                  <Icon name="solid:circle" />
                  <span>
                    These bids are below the{" "}
                    <strong>{voteThreshold * 100}% vote share threshold</strong>
                  </span>
                  <Icon name="circle-info" />
                </div>
              </Tooltip>

              <div className="border-palette-beige w-full border-t-2" />
            </div>
          </TD>
        </TR>
      )}

      <TR
        {...rowProps}
        key={row._bid.id}
        className={twMerge(
          rowProps.className,
          "bg-none!",
          rowIndex % 2 === 0 && "bg-palette-beige/5!"
        )}
      >
        {children}
      </TR>
    </Fragment>
  )
}
