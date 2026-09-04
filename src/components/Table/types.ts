import type { WdSizeInput } from '../../shared/types'

export type TableSize = WdSizeInput
export type TableSortType = 'asc' | 'desc'
export type TableItem = Record<string, unknown>
export type TableTextDirection = 'left' | 'center' | 'right'
export type TableClickEventType = 'single' | 'double'
export type TableColumnAlign = 'start' | 'center' | 'end' | 'left' | 'right'
export type TableSortMode = 'client' | 'emit'

export type TableFilterComparison = '=' | '!=' | '>' | '>=' | '<' | '<=' | 'between' | 'in'

export type TableFilterOption =
  | { field: string; comparison: 'between'; criteria: [number, number] }
  | { field: string; comparison: '=' | '!='; criteria: number | string }
  | { field: string; comparison: '>' | '>=' | '<' | '<='; criteria: number }
  | { field: number | string; comparison: 'in'; criteria: number[] | string[] }
  | { field: string; comparison: (value: unknown, criteria: string) => boolean; criteria: string }

export interface TableColumnFilter {
  label: string
  value: string | number
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
  filterable?: boolean
  filters?: TableColumnFilter[]
  showOverflowTooltip?: boolean
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

export type TableHeaderItemClassName = string | ((header: TableHeader, columnNumber: number) => string)
export type TableBodyRowClassName = string | ((item: TableItem, rowNumber: number) => string)
export type TableBodyItemClassName = string | ((column: string, rowNumber: number) => string)

export interface TableProps {
  columns: TableColumnDefinition[]
  rows: TableItem[]
  selection?: TableItem[] | null
  selectionMode?: 'multiple' | 'single' | null
  selectedItem?: TableItem | null
  serverOptions?: TableServerOptions | null
  serverItemsLength?: number
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
  rowsItems?: number[]
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
  showIndex?: boolean
  showIndexSymbol?: string
  indexColumnWidth?: number
  fixedCheckbox?: boolean
  fixedExpand?: boolean
  fixedIndex?: boolean
  expandColumnWidth?: number
  checkboxColumnWidth?: number | null
  hideHeader?: boolean
  hideRowsPerPage?: boolean
  expandable?: boolean
  expandedRowKeys?: Array<string | number>
  clickRowToExpand?: boolean
  clickEventType?: TableClickEventType
  headerTextDirection?: TableTextDirection
  bodyTextDirection?: TableTextDirection
  headerItemClassName?: TableHeaderItemClassName
  bodyRowClassName?: TableBodyRowClassName
  bodyExpandRowClassName?: TableBodyRowClassName
  bodyItemClassName?: TableBodyItemClassName
  tableClassName?: string
  headerClassName?: string
  rowsPerPageMessage?: string
  rowsOfPageSeparatorMessage?: string
  preventContextMenuRow?: boolean
  tableNodeId?: string
  rowKey?: string
  ariaLabel?: string
  size?: TableSize
}

export interface TableEmits {
  (event: 'row-click', payload: { row: TableItem; index: number }, nativeEvent: Event): void
  (event: 'contextmenuRow', item: TableItem, nativeEvent: MouseEvent): void
  (event: 'selectRow', item: TableItem): void
  (event: 'deselectRow', item: TableItem): void
  (event: 'expand', payload: { row: TableItem; expanded: boolean }): void
  (event: 'sort', payload: TableSortPayload): void
  (event: 'filter', filters: Record<string, unknown> | null): void
  (event: 'update:selection', value: TableItem[]): void
  (event: 'update:selectedItem', value: TableItem | null): void
  (event: 'update:serverOptions', value: TableServerOptions): void
  (event: 'updatePageItems', items: TableItem[]): void
  (event: 'updateTotalItems', items: TableItem[]): void
  (event: 'selectAll'): void
  (event: 'update:currentRowKey', value: string | number | null): void
  (event: 'current-change', item: TableItem | null, oldItem: TableItem | null): void
  (event: 'update:page', value: number): void
  (event: 'page', value: number): void
  (event: 'update:expandedRowKeys', value: Array<string | number>): void
  (event: 'update:filters', value: Record<string, unknown> | null): void
}

/** @internal Normalized render model. */
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
}
