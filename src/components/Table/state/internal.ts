import type { TableColumnFilter, TableSortType } from '../types'

export interface ServerOptionsComputed {
  page: number
  rowsPerPage: number
  sortBy: string | string[] | null
  sortType: TableSortType | TableSortType[] | null
}

export interface HeaderForRender {
  text: string
  value: string
  sortable?: boolean
  sortType?: TableSortType | 'none'
  fixed?: boolean | 'left' | 'right'
  width?: number
  minWidth?: number
  align?: 'start' | 'center' | 'end'
  resizable?: boolean
  filterable?: boolean
  filters?: TableColumnFilter[]
  colspan?: number
  rowspan?: number
}

export interface ClientSortOptions {
  sortBy: string | string[]
  sortDesc: boolean | boolean[]
}

export type MultipleSelectStatus = 'allSelected' | 'noneSelected' | 'partSelected'

export type EmitsEventName =
  | 'row-click'
  | 'row-dblclick'
  | 'row-contextmenu'
  | 'select-row'
  | 'deselect-row'
  | 'expand-change'
  | 'sort-change'
  | 'update:selection'
  | 'update:serverOptions'
  | 'update:expandedRowKeys'
  | 'filter-change'
  | 'select-all'
  | 'update:filterModel'
  | 'update:columnWidths'
  | 'update:hiddenColumns'
  | 'update:columnOrder'

export type TableEmitFn = (event: EmitsEventName, ...args: unknown[]) => void
