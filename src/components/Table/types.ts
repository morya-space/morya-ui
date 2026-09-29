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

/** Tree mode. Nested `children` or flat `parentId` via `transform`. */
export interface TableTreeConfig {
  childrenField?: string
  indent?: number
  expandAll?: boolean
  expandRowKeys?: Array<string | number>
  accordion?: boolean
  trigger?: 'default' | 'row' | 'manual'
  toggleMethod?: (params: { row: TableItem; expanded: boolean }) => boolean
  lazy?: boolean
  hasChildField?: string
  loadMethod?: (row: TableItem) => Promise<TableItem[]> | TableItem[]
  transform?: boolean
  rowField?: string
  parentField?: string
  treeNode?: string
  showLine?: boolean
}

/** Detail row expand. Mutually exclusive with `treeConfig`. */
export interface TableExpandConfig {
  expandAll?: boolean
  expandRowKeys?: Array<string | number>
  accordion?: boolean
  /** `default` = expand column; `row` = whole row; `manual` = API only. */
  trigger?: 'default' | 'row' | 'manual'
  toggleMethod?: (params: { row: TableItem; expanded: boolean }) => boolean
}

/** Multi-select options. */
export interface TableCheckboxConfig {
  checkStrictly?: boolean
  checkMethod?: (row: TableItem) => boolean
  showHeader?: boolean
  /** Initial checked row keys (applied once when uncontrolled). */
  checkRowKeys?: Array<string | number>
  /** Keep selection for rows not in the current `rows` snapshot. Default true. */
  reserve?: boolean
  /** `default` = checkbox only; `row` = clicking the row toggles selection. */
  trigger?: 'default' | 'row'
}

/** Single-select options. */
export interface TableRadioConfig {
  strict?: boolean
  checkMethod?: (row: TableItem) => boolean
  trigger?: 'default' | 'row'
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
  serverOptions?: TableServerOptions | null
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
  expandConfig?: TableExpandConfig | null
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
  treeConfig?: TableTreeConfig | null
  checkboxConfig?: TableCheckboxConfig | null
  radioConfig?: TableRadioConfig | null
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
  children?: TableHeader[]
  colspan?: number
  rowspan?: number
}
