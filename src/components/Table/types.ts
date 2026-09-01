import type { WiSizeInput } from '../../shared/types'

export type TableSize = WiSizeInput
export type TableSortType = 'asc' | 'desc'
export type TableItem = Record<string, unknown>
export type TableTextDirection = 'left' | 'center' | 'right'
export type TableClickEventType = 'single' | 'double'

export type TableFilterComparison = '=' | '!=' | '>' | '>=' | '<' | '<=' | 'between' | 'in'

export type TableFilterOption =
  | { field: string; comparison: 'between'; criteria: [number, number] }
  | { field: string; comparison: '=' | '!='; criteria: number | string }
  | { field: string; comparison: '>' | '>=' | '<' | '<='; criteria: number }
  | { field: number | string; comparison: 'in'; criteria: number[] | string[] }
  | { field: string; comparison: (value: unknown, criteria: string) => boolean; criteria: string }

export interface TableHeader {
  text: string
  value: string
  sortable?: boolean
  fixed?: boolean
  width?: number
}

export interface TableServerOptions {
  page: number
  rowsPerPage: number
  sortBy?: string | string[]
  sortType?: TableSortType | TableSortType[]
}

export type TableClickRowArgument = TableItem & {
  isSelected?: boolean
  indexInCurrentPage?: number
}

export interface TableUpdateSortArgument {
  sortType: TableSortType | null
  sortBy: string
}

export type TableHeaderItemClassName = string | ((header: TableHeader, columnNumber: number) => string)
export type TableBodyRowClassName = string | ((item: TableItem, rowNumber: number) => string)
export type TableBodyItemClassName = string | ((column: string, rowNumber: number) => string)

export interface TableProps {
  headers: TableHeader[]
  items: TableItem[]
  /** `null` disables selection; array enables multi-select (`selectionMode="multiple"`). */
  itemsSelected?: TableItem[] | null
  /** Row selection mode. `multiple` uses `WiCheckbox`; `single` uses `WiRadio`. */
  selectionMode?: 'multiple' | 'single' | null
  /** Single-select row (`v-model:selected-item`). */
  selectedItem?: TableItem | null
  serverOptions?: TableServerOptions | null
  serverItemsLength?: number
  sortBy?: string | string[]
  sortType?: TableSortType | TableSortType[]
  multiSort?: boolean
  mustSort?: boolean
  filterOptions?: TableFilterOption[] | null
  searchField?: string | string[]
  searchValue?: string
  rowsPerPage?: number
  rowsItems?: number[]
  currentPage?: number
  loading?: boolean
  emptyMessage?: string
  alternating?: boolean
  /** Element Plus `stripe` — zebra rows. Falls back to `alternating`. */
  stripe?: boolean
  borderCell?: boolean
  /** Element Plus `border` — outer border and column dividers. */
  border?: boolean
  noHover?: boolean
  /** Element Plus `highlight-current-row`. */
  highlightCurrentRow?: boolean
  /** Element Plus `current-row-key` / v-model:current-row-key. */
  currentRowKey?: string | number | null
  /** Element Plus `show-overflow-tooltip`. */
  showOverflowTooltip?: boolean
  /** Element Plus `fit` — columns stretch to table width (default `true`). */
  fit?: boolean
  /** Element Plus `empty-text` alias of `emptyMessage`. */
  emptyText?: string
  /** Element Plus `show-header` — inverse of `hideHeader` when set. */
  showHeader?: boolean
  /** Element Plus `max-height` — scrollable body (alias of `tableHeight`). */
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
  hideFooter?: boolean
  hideHeader?: boolean
  hideRowsPerPage?: boolean
  buttonsPagination?: boolean
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
  /** Stable row key field; defaults to `id`. Falls back to row index when missing. */
  rowKey?: string
  /** Accessible name for the table region. */
  ariaLabel?: string
  size?: TableSize
}

export interface TableEmits {
  (event: 'clickRow', item: TableClickRowArgument, nativeEvent: Event): void
  (event: 'contextmenuRow', item: TableItem, nativeEvent: MouseEvent): void
  (event: 'selectRow', item: TableItem): void
  (event: 'deselectRow', item: TableItem): void
  (event: 'expandRow', index: number, item: TableItem): void
  (event: 'updateSort', payload: TableUpdateSortArgument): void
  (event: 'updateFilter', items: TableItem[]): void
  (event: 'update:itemsSelected', value: TableItem[]): void
  (event: 'update:selectedItem', value: TableItem | null): void
  (event: 'update:serverOptions', value: TableServerOptions): void
  (event: 'updatePageItems', items: TableItem[]): void
  (event: 'updateTotalItems', items: TableItem[]): void
  (event: 'selectAll'): void
  (event: 'update:currentRowKey', value: string | number | null): void
  (event: 'currentChange', item: TableItem | null, oldItem: TableItem | null): void
}
