import { Icon } from "@/components/Icon"
import { TD, TR } from "@/components/StyledTable"
import { BaseRowObject, RowRenderProps } from "@/components/StyledTable/types"
import { Tooltip } from "@/components/Tooltip"
import { voteThresholdTooltip } from "@/components/ToolTips"
import { AugmentedBidFromNumiaSlimmed } from "@/contract-apis/types"
import { Fragment } from "react"
import { twJoin, twMerge } from "tailwind-merge"

export function RowComponent<
  Row extends BaseRowObject & {
    _bid: AugmentedBidFromNumiaSlimmed
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
    row._bidFromContract.vote_perc !== null &&
    row._bidFromContract.vote_perc < voteThreshold

  return (
    <Fragment key={row._bid.id}>
      {!!shouldShowVoteThresholdLine && (
        <TR className="js-vote-threshold-line bg-none [&~&]:hidden">
          <TD colSpan={99} className="!p-0">
            <div
              className={twJoin(
                "flex items-center justify-between gap-3",
                "whitespace-nowrap text-xs text-palette-beige"
              )}
            >
              <div className="w-full border-t-2 border-palette-beige" />

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

              <div className="w-full border-t-2 border-palette-beige" />
            </div>
          </TD>
        </TR>
      )}

      <TR
        {...rowProps}
        key={row._bid.id}
        className={twMerge(
          rowProps.className,
          "!bg-none",
          rowIndex % 2 === 0 && "!bg-palette-beige/5"
        )}
      >
        {children}
      </TR>
    </Fragment>
  )
}
