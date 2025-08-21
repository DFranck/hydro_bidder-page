"use client"

import { Icon } from "@/components/Icon"
import { TD, TR } from "@/components/StyledTable"
import { RowRenderProps } from "@/components/StyledTable/types"
import { twMerge } from "tailwind-merge"
import { BidderRow } from "./BidderPage"

type Props = RowRenderProps<BidderRow, keyof BidderRow> & {
  isOpened: boolean
  canOpen: boolean
  onToggle: (bidId: string | number) => void
}

export function BidderTableItem({
  children,
  row,
  rowProps,
  isOpened,
  canOpen,
  onToggle,
}: Props) {
  const bidId = (row._bid as any).id
  const handleClick: React.MouseEventHandler<HTMLTableRowElement> = (e) => {
    const el = e.target as HTMLElement
    if (el.closest("a,button,[role=button],input,select,textarea")) return
    if (canOpen) onToggle(bidId)
  }
  return (
    <>
      <TR
        {...rowProps}
        onClick={(e) => {
          rowProps?.onClick?.(e as any)
          handleClick(e as any)
        }}
        aria-expanded={isOpened}
        data-opened={isOpened}
        data-can-open={canOpen}
        className={twMerge(rowProps.className)}
      >
        {children}
        <TD className="text-right">
          <span className="mr-2 md:mr-0 md:hidden">
            {isOpened ? "Collapse" : "Expand"}
          </span>
          {canOpen ? (
            <span
              className={twMerge(
                "inline-block origin-center transform-gpu transition-transform duration-200 ",
                isOpened ? "rotate-180" : "rotate-0"
              )}
              aria-hidden
            >
              <Icon name="chevron-down" className="size-4" />
            </span>
          ) : (
            <></>
          )}
        </TD>
      </TR>

      {isOpened && row.additionalTributes ? (
        <tr>
          <TD
            colSpan={Object.keys(row).length}
            className="bg-palette-green/5 p-4"
          >
            {row.additionalTributes}
          </TD>
        </tr>
      ) : null}

      <tr aria-hidden>
        <td className="h-1" colSpan={Object.keys(row).length} />
      </tr>
    </>
  )
}
