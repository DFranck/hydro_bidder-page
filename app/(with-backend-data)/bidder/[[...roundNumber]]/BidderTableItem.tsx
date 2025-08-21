"use client"

import { Icon } from "@/components/Icon"
import { TD, TR } from "@/components/StyledTable"
import { RowRenderProps } from "@/components/StyledTable/types"
import { twMerge } from "tailwind-merge"
import { BidderRow } from "./BidderPage"
import { MiniCollapsible } from "./components/MiniCollapsible"
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
        className={twMerge(
          rowProps.className,
          canOpen ? "cursor-pointer hover:bg-white/5" : "cursor-default",
        )}
      >
        {children}
      </TR>

      {isOpened && row.additionalTributes ? (
  <tr>
    <TD colSpan={Object.keys(row).length} className="p-0 bg-transparent">
      <MiniCollapsible
        title={
          <div className="flex items-center gap-2">
            <Icon name="solid:gift" />
            <span>Tributes</span>
            <span className="opacity-70">({row.tributeCount ?? 0})</span>
          </div>
        }
      >
              {row.additionalTributes}
            </MiniCollapsible>
          </TD>
        </tr>
      ) : null}


      <tr aria-hidden>
        <td className="h-1" colSpan={Object.keys(row).length} />
      </tr>
    </>
  )
}
