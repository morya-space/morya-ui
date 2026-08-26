import type { WiRenderable } from '../../shared/content'
import type { WiSizeInput } from '../../shared/types'

export type TableSize = WiSizeInput
export type TableSortOrder = 'asc' | 'desc' | 0 | 1 | -1 | null
export type TableSelectionMode = 'single' | 'multiple'
export type TableSortMode = 'client' | 'emit'
export type TableFixed = 'left' | 'right'

export interface TableColumnFilterOption {
  label: string
  value: string | number | boolean | null
}

export interface TableColumn<Row extends Record<string, unknown> = Record<string, unknown>> {
  key: keyof Row & string
  label: string
  align?: 'start' | 'center' | 'end'
  sortable?: boolean
  width?: string | number
  /** Column min width; used when `width` is omitted (: default 80). */
  minWidth?: string | number
  fixed?: TableFixed
  filterable?: boolean
  /** Optional preset filter values; when omitted, free-text filter is used. */
  filters?: TableColumnFilterOption[]
  /** Custom cell content. Named `cell-${key}` slot still wins. */
  render?: (row: Row, column: TableColumn<Row>) => WiRenderable
}

export type TableFilters = Record<string, string | number | boolean | null | undefined>

export interface TableProps {
  columns: TableColumn[]
  rows: Record<string, unknown>[]
  rowKey?: string
  emptyText?: string
  emptyDescription?: string
  loading?: boolean
  loadingText?: string
  size?: TableSize
  sortField?: string
  sortOrder?: TableSortOrder
  /** `client` sorts locally; `emit` only emits sort events. */
  sortMode?: TableSortMode
  /**
   * When true (default), columns without `width` share leftover space
   * proportionally by `minWidth` ( `fit`).
   */
  fit?: boolean
  striped?: boolean
  bordered?: boolean
  highlightCurrent?: boolean
  rowHover?: boolean
  selectionMode?: TableSelectionMode
  /** Selected row(s); single = one row object or null, multiple = array. */
  selection?: Record<string, unknown> | Record<string, unknown>[] | null
  filters?: TableFilters
  paginator?: boolean
  rowsPerPage?: number
  /** 1-based page when paginator is on. */
  page?: number
  /** Show an expand column. Slot `expansion` renders the extra row. */
  expandable?: boolean
  expandedRowKeys?: Array<string | number>
  rowExpandable?: (row: Record<string, unknown>) => boolean
}

export interface TableEmits {
  (event: 'update:sortField', value: string | undefined): void
  (event: 'update:sortOrder', value: TableSortOrder): void
  (event: 'sort', payload: { sortField?: string; sortOrder: TableSortOrder }): void
  (event: 'update:selection', value: Record<string, unknown> | Record<string, unknown>[] | null): void
  (event: 'update:filters', value: TableFilters): void
  (event: 'filter', value: TableFilters): void
  (event: 'update:page', value: number): void
  (event: 'page', value: number): void
  (event: 'row-click', payload: { row: Record<string, unknown>; index: number }): void
  (event: 'current-change', row: Record<string, unknown> | null): void
  (event: 'update:expandedRowKeys', value: Array<string | number>): void
  (event: 'expand', payload: { row: Record<string, unknown>; expanded: boolean }): void
}
