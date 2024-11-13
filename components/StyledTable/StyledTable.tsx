"use client"

import isEqual from "lodash/isEqual"
import { MouseEvent, useEffect, useMemo, useReducer } from "react"
import { TABLE } from "./components/TABLE"
import { TBODY } from "./components/TBODY"
import { TD } from "./components/TD"
import { TFOOT } from "./components/TFOOT"
import { TH } from "./components/TH"
import { THEAD } from "./components/THEAD"
import { TR } from "./components/TR"
import { initialTableState, tableStateReducer } from "./reducer"
import { BaseRowObject, TableProps } from "./types"

export function StyledTable<R extends BaseRowObject, K extends keyof R>({
  className,
  columns,
  contentForFirstRow = null,
  contentForFooterRow = null,
  contentAfterHeaderRow = null,
  contentBeforeHeaderRow = null,
  contentForLastRow = null,
  initialSortedColumnKey,
  renderRow,
  rows,
  ...otherProps
}: TableProps<R, K>) {
  const [tableState, tableDispatch] = useReducer(
    tableStateReducer,
    initialTableState
  )

  const {
    columns: columnsInState,
    rows: rowsInState,
    sortDirection,
    sortedColumnKey,
    sortedRows,
  } = tableState

  useEffect(() => {
    if (
      columns.length === 0 ||
      rows.length === 0 ||
      (isEqual(columns, columnsInState) && isEqual(rows, rowsInState))
    ) {
      return
    }

    tableDispatch({
      type: "setTableData",
      payload: {
        columns,
        dispatch: tableDispatch,
        initialSortedColumnKey,
        rows,
      },
    })
  }, [columns, columnsInState, initialSortedColumnKey, rows, rowsInState])

  const renderedHeaderCells = useMemo(() => {
    function handleClickToSort(
      columnKey: K,
      event: MouseEvent<HTMLTableCellElement>
    ) {
      event.preventDefault()

      tableDispatch({
        type: "setSortedColumnKey",
        payload: {
          sortDirection: sortDirection === "ASC" ? "DESC" : "ASC",
          sortedColumnKey: columnKey,
        },
      })
    }

    return columnsInState.map((column) => (
      <TH
        {...column.propsForHeaderCell}
        isSortable={column.isSortable}
        isSorted={column.key === sortedColumnKey}
        key={String(column.key)}
        sortDirection={sortDirection ?? column.initialSortDirection}
        textAlign={column.textAlign}
        onClick={
          column.isSortable
            ? handleClickToSort.bind(null, column.key)
            : undefined
        }
      >
        {column.label || <>&nbsp;</>}
      </TH>
    ))
  }, [columnsInState, sortDirection, sortedColumnKey])

  const renderedRows = useMemo(
    () =>
      sortedRows.map((row, rowIndex) => {
        const rowProps = row.propsForRow ?? {}

        const renderedCells = columnsInState.map((column) => (
          <TD
            key={String(column.key)}
            label={column.key !== "selectorInput" ? column.label : undefined}
            textAlign={column.textAlign}
            {...(column.propsForCells ?? {})}
          >
            {row[column.key]}
          </TD>
        ))

        return renderRow ? (
          renderRow({
            children: renderedCells,
            row,
            rowIndex,
            rowProps,
            sortDirection,
            sortedColumnKey,
            sortedRows,
          })
        ) : (
          <TR key={rowIndex} variant="tbody" {...rowProps}>
            {renderedCells}
          </TR>
        )
      }),
    [columnsInState, renderRow, sortedRows, sortDirection, sortedColumnKey]
  )

  return (
    <TABLE {...otherProps}>
      <THEAD>
        {contentBeforeHeaderRow}
        <TR className="max-sm:hidden" variant="thead">
          {renderedHeaderCells}
        </TR>
        {contentAfterHeaderRow}
      </THEAD>

      <TBODY>
        {contentForFirstRow}
        {renderedRows}
        {contentForLastRow}
      </TBODY>

      {contentForFooterRow && <TFOOT>{contentForFooterRow}</TFOOT>}
    </TABLE>
  )
}
