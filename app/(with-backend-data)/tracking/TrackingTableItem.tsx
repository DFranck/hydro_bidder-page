import { TD, TR } from "@/components/StyledTable"
import { RowRenderProps } from "@/components/StyledTable/types"
import { TrackingRow } from "@/app/(with-backend-data)/tracking/page"
import { twMerge } from "tailwind-merge"
import { classNames } from "@/app/(with-backend-data)/tracking/classNames"

type TrackingTableItemProps = RowRenderProps<TrackingRow, keyof TrackingRow>

export function TrackingTableItem({
  children,
  row,
  rowProps,
}: TrackingTableItemProps) {
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
          key={row._bid.id + "_additional"}
          className={classNames.additionalRow}
        >
          <TD className={classNames.additionalCell} colSpan={2} />
          <TD className={classNames.additionalCell} colSpan={2}>
            {row.additional}
          </TD>
          <TD className={classNames.additionalCell} colSpan={1} />
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
