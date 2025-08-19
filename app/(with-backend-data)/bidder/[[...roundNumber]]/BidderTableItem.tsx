"use client"

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
    // ne pas toggler si on clique sur un lien/bouton/inputs
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
          <TD colSpan={Object.keys(row).length} className="bg-palette-green/5 p-4">
            {row.additionalTributes}
          </TD>
        </tr>
      ) : null}

      {/* petit spacer visuel entre les groupes */}
      <tr aria-hidden>
        <td className="h-1" colSpan={Object.keys(row).length} />
      </tr>
    </>
  )
}
