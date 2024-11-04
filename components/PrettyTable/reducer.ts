"use client"

import sortBy from "lodash/sortBy"
import { Reducer } from "react"
import { TableState, TableStateAction } from "./types"

export const initialTableState: TableState<any, any> = {
  columns: [],
  rows: [],
  sortDirection: null,
  sortedColumnKey: null,
  sortedRows: [],
}

export const tableStateReducer: Reducer<
  TableState<any, any>,
  TableStateAction<any, any>
> = (state, action) => {
  let newState = { ...state }

  switch (action.type) {
    case "setSortedColumnKey": {
      const { sortDirection, sortedColumnKey } = action.payload

      const columnDescriptor = state.columns.find(
        (column) => column.key === sortedColumnKey
      )

      const sortFunction =
        columnDescriptor?.customValueGetter ??
        ((row) => String(row[sortedColumnKey]))

      const newSortedRows = sortBy(state.rows, sortFunction)

      if (sortDirection === "DESC") {
        newSortedRows.reverse()
      }

      newState = {
        ...state,
        sortDirection,
        sortedColumnKey: sortedColumnKey,
        sortedRows: newSortedRows,
      }

      break
    }

    case "setState": {
      newState = {
        ...state,
        ...action.payload,
      }
      break
    }

    case "setTableData": {
      const { columns, dispatch, initialSortedColumnKey, rows } = action.payload

      const sortedColumn = columns.find(
        (column) => column.key === initialSortedColumnKey
      )

      if (sortedColumn) {
        dispatch({
          type: "setSortedColumnKey",
          payload: {
            sortDirection: sortedColumn.initialSortDirection ?? "ASC",
            sortedColumnKey: initialSortedColumnKey,
          },
        })
      }

      newState = {
        ...state,
        columns,
        rows,
        sortedRows: rows,
      }
      break
    }

    default: {
      newState = { ...state }
    }
  }

  if (process.env.NODE_ENV === "development") {
    // console.log(`Table action fired:`, { action, state, newState })
  }

  return newState
}
