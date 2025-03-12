import { classNames } from "@/app/(with-backend-data)/bidder-dashboard/classNames"
import { BidRow } from "@/app/(with-backend-data)/bidder-dashboard/page"
import { TD, TR } from "@/components/StyledTable"
import { RowRenderProps } from "@/components/StyledTable/types"
import { twMerge } from "tailwind-merge"

type BidDashboardTableItemProps = RowRenderProps<BidRow, keyof BidRow>

export function BidDashboardTableItem({
  children,
  row,
  rowProps,
}: BidDashboardTableItemProps) {
  return (
    <>
      <TR
        key={row._bid.id}
        className={twMerge(row.additional && classNames.openedRow)}
        {...rowProps}
      >
        {children}
      </TR>
      {row.additional ? (
        <tr
          key={`${row._bid.id}-additional`}
          className={classNames.additionalRow}
        >
          <TD
            className={classNames.additionalCell}
            colSpan={Object.keys(row).length - 2}
          >
            {row.additional}
          </TD>
        </tr>
      ) : (
        <tr>
          <td className="h-0" colSpan={Object.keys(row).length - 2}>
            {" "}
          </td>
        </tr>
      )}
      <tr>
        <td className="h-1" colSpan={Object.keys(row).length - 2}>
          {" "}
        </td>
      </tr>
    </>
  )
}
