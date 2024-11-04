import { ComponentPropsWithRef, Dispatch, ReactNode } from "react"

export interface TableState<R extends BaseRowObject, K extends keyof R> {
  columns: ColumnObject<R, K>[]
  rows: R[]
  sortedColumnKey: K | null
  sortedRows: R[]
  sortDirection: SortDirection | null
}

export type TableStateAction<R extends BaseRowObject, K extends keyof R> =
  | {
      type: "setSortedColumnKey"
      payload: {
        sortDirection: SortDirection
        sortedColumnKey: K
      }
    }
  | {
      type: "setState"
      payload: Partial<TableState<R, K>>
    }
  | {
      type: "setTableData"
      payload: Pick<TableState<R, K>, "columns" | "rows"> &
        Pick<TableProps<R, K>, "initialSortedColumnKey"> & {
          dispatch: Dispatch<TableStateAction<R, K>>
        }
    }

export interface BaseRowObject extends Record<string, any> {
  propsForRow?: ComponentPropsWithRef<"tr">
}

export interface ColumnObject<R extends BaseRowObject, K extends keyof R> {
  customValueGetter?: (rowObject: R) => string | number
  initialSortDirection?: SortDirection
  isSortable?: boolean
  key: K
  label: ReactNode
  propsForCells?: ComponentPropsWithRef<"td">
  propsForHeaderCell?: ComponentPropsWithRef<"th">
  textAlign?: "center" | "left" | "right"
}

export interface TableProps<R extends BaseRowObject, K extends keyof R>
  extends Omit<ComponentPropsWithRef<"table">, "children"> {
  columns: ColumnObject<R, K>[]
  contentAfterHeaderRow?: ReactNode
  contentBeforeHeaderRow?: ReactNode
  contentForFirstRow?: ReactNode
  contentForFooterRow?: ReactNode
  contentForLastRow?: ReactNode
  initialSortedColumnKey?: K
  renderCells?: Record<K, CellRenderFunction<R, K>>
  renderHeaderCells?: Record<K, HeaderCellRenderFunction<R, K>>
  renderRow?: RowRenderFunction<R, K>
  rows: R[]
}

export interface CellRenderFunction<
  R extends BaseRowObject,
  K extends keyof R,
> {
  (renderProps: {}): ReactNode
}

export interface HeaderCellRenderFunction<
  R extends BaseRowObject,
  K extends keyof R,
> {
  (renderProps: {}): ReactNode
}

export interface HeaderRowRenderFunction<
  R extends BaseRowObject,
  K extends keyof R,
> {
  (renderProps: { children: ReactNode }): ReactNode
}

export interface RowRenderFunction<R extends BaseRowObject, K extends keyof R> {
  (renderProps: {
    children: ReactNode
    row: R
    rowIndex: number
    rowProps: ComponentPropsWithRef<"tr">
    sortDirection: SortDirection | null
    sortedColumnKey: K
    sortedRows: R[]
  }): ReactNode
}

export type SortDirection = "ASC" | "DESC"
