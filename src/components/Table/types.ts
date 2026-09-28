import type { RootPassThrough } from '../../shared/passThrough'
import type { MSizeInput } from '../../shared/types'

export type TableSize = MSizeInput
export type TableSortType = 'asc' | 'desc'
export type TableItem = Record<string, unknown>
export type TableTextDirection = 'left' | 'center' | 'right'
export type TableColumnAlign = 'start' | 'center' | 'end'
export type TableSortMode = 'client' | 'emit'

export type TableFilterComparison = '=' | '!=' | '>' | '>=' | '<' | '<=' | 'between' | 'in'

export type TableFilterOption =
  | { field: string; comparison: 'between'; criteria: [number, number] }
  | { field: string; comparison: '=' | '!='; criteria: number | string }
  | { field: string; comparison: '>' | '>=' | '<' | '<='; criteria: number }
  | { field: number | string; comparison: 'in'; criteria: number[] | string[] }
  | { field: string; comparison: (value: unknown, criteria: string) => boolean; criteria: string }

/** Per-column header filter option (checkbox list). */
export interface TableColumnFilter {
  label: string
  value: unknown
}

export interface TableColumnDefinition {
  key: string
  label: string
  width?: number
  minWidth?: number
  sortable?: boolean
  fixed?: boolean | 'left' | 'right'
  align?: TableColumnAlign
  render?: (row: TableItem) => unknown
  showOverflowTooltip?: boolean
  resizable?: boolean
  filterable?: boolean
  filters?: TableColumnFilter[]
  children?: TableColumnDefinition[]
  editable?: boolean
}

/** Normalized column used inside the component. */
export interface TableColumn {
  key: string
  label: string
  width?: number
  minWidth: number
  sortable?: boolean
  fixed?: boolean | 'left' | 'right'
  align?: 'start' | 'center' | 'end'
  render?: (row: TableItem) => unknown
  showOverflowTooltip?: boolean
  resizable?: boolean
  filterable?: boolean
  filters?: TableColumnFilter[]
  editable?: boolean
}

export interface TableServerOptions {
  page: number
  rowsPerPage: number
  sortBy?: string | string[]
  sortType?: TableSortType | TableSortType[]
}

export interface TableSortPayload {
  sortField?: string
  sortOrder?: TableSortType | null
}

export interface TableEditConfig {
  mode?: 'cell'
  trigger?: 'click' | 'dblclick'
}

export interface TableSpanMethodParams {
  row: TableItem
  column: TableHeader
  rowIndex: number
  columnIndex: number
}

export type TableSpanMethodResult =
  | { rowspan: number; colspan: number }
  | [number, number]
  | undefined
  | null

export type TableSpanMethod = (params: TableSpanMethodParams) => TableSpanMethodResult

export interface TableFooterMethodParams {
  columns: TableHeader[]
  data: TableItem[]
}

export type TableFooterMethod = (params: TableFooterMethodParams) => Array<Array<string | number | null | undefined>>

export interface TableEditChangePayload {
  row: TableItem
  column: string
  value: unknown
  oldValue: unknown
  rowIndex: number
}

export type TableHeaderItemClassName = string | ((header: TableHeader, columnNumber: number) => string)
export type TableBodyRowClassName = string | ((item: TableItem, rowNumber: number) => string)
export type TableBodyItemClassName = string | ((column: string, rowNumber: number) => string)

export interface TableProps {
  pt?: RootPassThrough
  columns: TableColumnDefinition[]
  rows: TableItem[]
  selection?: TableItem[] | null
  selectionMode?: 'multiple' | 'single' | null
  selectedItem?: TableItem | null
  /** Server mode when non-null; sync with `v-model:serverOptions`. */
  serverOptions?: TableServerOptions | null
  /** Total row count in server mode. */
  serverTotal?: number
  sortField?: string | string[]
  sortOrder?: TableSortType | TableSortType[]
  sortMode?: TableSortMode
  multiSort?: boolean
  mustSort?: boolean
  filterOptions?: TableFilterOption[] | null
  filters?: Record<string, unknown> | null
  searchField?: string | string[]
  searchValue?: string
  rowsPerPage?: number
  /** Page size options for the built-in paginator. */
  pageSizes?: number[]
  page?: number
  paginator?: boolean
  loading?: boolean
  emptyText?: string
  emptyDescription?: string
  striped?: boolean
  bordered?: boolean
  rowHover?: boolean
  highlightCurrent?: boolean
  currentRowKey?: string | number | null
  showOverflowTooltip?: boolean
  fit?: boolean
  showHeader?: boolean
  maxHeight?: number | null
  fixedHeader?: boolean
  tableHeight?: number | null
  tableMinHeight?: number
  /**
   * Stretch to fill the parent. Use with `MPageContent fill` only for full-viewport admin main lists.
   * Ignored when `maxHeight` / `tableHeight` is set.
   */
  fill?: boolean
  showIndex?: boolean
  showIndexSymbol?: string
  indexColumnWidth?: number
  fixedCheckbox?: boolean
  fixedExpand?: boolean
  fixedIndex?: boolean
  expandColumnWidth?: number
  checkboxColumnWidth?: number | null
  showRowsPerPage?: boolean
  expandable?: boolean
  expandedRowKeys?: Array<string | number>
  clickRowToExpand?: boolean
  headerTextDirection?: TableTextDirection
  bodyTextDirection?: TableTextDirection
  headerItemClassName?: TableHeaderItemClassName
  bodyRowClassName?: TableBodyRowClassName
  bodyExpandRowClassName?: TableBodyRowClassName
  bodyItemClassName?: TableBodyItemClassName
  tableClassName?: string
  headerClassName?: string
  rowKey?: string
  ariaLabel?: string
  size?: TableSize
  columnWidths?: Record<string, number> | null
  virtual?: boolean
  virtualRowHeight?: number
  hiddenColumns?: string[] | null
  columnOrder?: string[] | null
  showFooter?: boolean
  footerMethod?: TableFooterMethod | null
  spanMethod?: TableSpanMethod | null
  editConfig?: TableEditConfig | null
}

export interface TableEmits {
  (event: 'row-click', payload: { row: TableItem; index: number }, nativeEvent: Event): void
  (event: 'row-dblclick', payload: { row: TableItem; index: number }, nativeEvent: Event): void
  (event: 'row-contextmenu', item: TableItem, nativeEvent: MouseEvent): void
  (event: 'select-row', item: TableItem): void
  (event: 'deselect-row', item: TableItem): void
  (event: 'select-all'): void
  (event: 'expand', payload: { row: TableItem; expanded: boolean }): void
  (event: 'sort', payload: TableSortPayload): void
  (event: 'filter', filters: Record<string, unknown> | null): void
  (event: 'update:selection', value: TableItem[]): void
  (event: 'update:selectedItem', value: TableItem | null): void
  (event: 'update:serverOptions', value: TableServerOptions): void
  (event: 'update:currentRowKey', value: string | number | null): void
  (event: 'current-change', item: TableItem | null, oldItem: TableItem | null): void
  (event: 'update:page', value: number): void
  (event: 'update:expandedRowKeys', value: Array<string | number>): void
  (event: 'update:filters', value: Record<string, unknown> | null): void
  (event: 'update:columnWidths', value: Record<string, number>): void
  (event: 'update:hiddenColumns', value: string[]): void
  (event: 'update:columnOrder', value: string[]): void
  (event: 'edit-change', payload: TableEditChangePayload): void
}

/** @internal */
export interface TableHeader {
  text: string
  value: string
  sortable?: boolean
  fixed?: boolean | 'left' | 'right'
  width?: number
  minWidth?: number
  align?: 'start' | 'center' | 'end'
  render?: (row: TableItem) => unknown
  showOverflowTooltip?: boolean
  resizable?: boolean
  filterable?: boolean
  filters?: TableColumnFilter[]
  editable?: boolean
  children?: TableHeader[]
  colspan?: number
  rowspan?: number
}
