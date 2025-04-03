import { TD, TR } from "@/components/StyledTable"
import { RowRenderProps } from "@/components/StyledTable/types"
import { ExperimentalRow } from "@/contract-apis/types"
import { classNames } from "./classNames"

type ExperimentalTableItemProps = RowRenderProps<
  ExperimentalRow,
  keyof ExperimentalRow
>

export function ExperimentalTableItem({
  children,
  row,
  rowProps,
}: ExperimentalTableItemProps) {
  return (
    <>
      <TR
        key={row._experimental.experimental_id}
        className={classNames.openedRow}
        {...rowProps}
      >
        {children}
      </TR>
      {row.additionalDescription ? (
        <tr
          key={row._experimental.experimental_id + "_additional"}
          className={classNames.additionalRow}
        >
          <TD className={classNames.additionalCell} colSpan={1}>
            {row.additionalDescription}
          </TD>
          <TD className={classNames.additionalCell} colSpan={1} />
          <TD className={classNames.additionalCell} colSpan={1}>
            {row.additionalStatus}
          </TD>
          <TD className={classNames.additionalCell} colSpan={1}>
            {row.additionalInitialAdressHoldings}
          </TD>
          <TD className={classNames.additionalCell} colSpan={1}>
            {row.additionalDeploymentAPR}
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
