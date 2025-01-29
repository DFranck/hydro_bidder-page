"use client"

import { usePersistedReducer } from "@/lib/usePersistedReducer"
import isEqual from "lodash/isEqual"
import { MouseEvent, useEffect, useMemo } from "react"
import { TABLE } from "./components/TABLE"
import { TBODY } from "./components/TBODY"
import { TD } from "./components/TD"
import { TFOOT } from "./components/TFOOT"
import { TH } from "./components/TH"
import { THEAD } from "./components/THEAD"
import { TR } from "./components/TR"
import { initialTableState, tableStateReducer } from "./reducer"
import {
  BaseRowObject,
  TableProps,
  TableState,
  TableStateAction,
} from "./types"

export function StyledTable<R extends BaseRowObject, K extends keyof R>({
  className,
  columns,
  rows,
  initialSortedColumnKey,
  renderRow,
  slotBeforeHeaderRow = null,
  slotAfterHeaderRow = null,
  slotBeforeFirstRow = null,
  slotAfterLastRow = null,
  slotForFooterRow = null,
  secondPassSortFunction = (sortedRows) => sortedRows,
  ...otherProps
}: TableProps<R, K>) {
  const uniqueTableId = columns.map((column) => column.key).join("-")

  const [tableState, tableDispatch] = usePersistedReducer<
    TableState<R, K>,
    TableStateAction<R, K>
  >({
    reducer: tableStateReducer,
    initialState: initialTableState,
    key: `tableState-${uniqueTableId}`,
    persistedKeys: ["sortDirection", "sortedColumnKey"],
    storage: sessionStorage,
  })

  const {
    columns: columnsInState,
    rows: rowsInState,
    sortDirection,
    sortedColumnKey,
    sortedRows,
  } = tableState

  const secondSortedRows = useMemo(() => {
    return secondPassSortFunction(sortedRows, sortDirection || "ASC")
  }, [sortedRows, secondPassSortFunction, sortDirection])

  useEffect(() => {
    if (isEqual(columns, columnsInState) && isEqual(rows, rowsInState)) {
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
      secondSortedRows.map((row, rowIndex) => {
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
            sortedColumnKey: sortedColumnKey as K,
            sortedRows,
          })
        ) : (
          <TR key={rowIndex} variant="tbody" {...rowProps}>
            {renderedCells}
          </TR>
        )
      }),
    [
      columnsInState,
      renderRow,
      sortDirection,
      sortedColumnKey,
      sortedRows,
      secondSortedRows,
    ]
  )

  return (
    <TABLE {...otherProps}>
      <THEAD>
        {slotBeforeHeaderRow}
        <TR className="max-sm:hidden" variant="thead">
          {renderedHeaderCells}
        </TR>
        {slotAfterHeaderRow}
      </THEAD>

      <TBODY>
        {slotBeforeFirstRow}
        {renderedRows}
        {slotAfterLastRow}
      </TBODY>

      {slotForFooterRow && <TFOOT>{slotForFooterRow}</TFOOT>}
    </TABLE>
  )
}
