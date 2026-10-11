import type { PassThroughPart } from '../../shared/passThrough'
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

/**
 * Unified sort configuration. Replaces the legacy `sortField` / `sortOrder` /
 * `multiSort` / `mustSort` / `sortMode` prop quintet.
 *
 * - `field` / `order`: initial sort state. Use `multiSort` for multi-column.
 * - `multiple`: enable multi-column sort (Shift+click on headers adds columns).
 * - `must`: when true, sort cannot be cleared — clicking a sorted column cycles
 *   asc → desc → asc instead of asc → desc → none.
 * - `mode`: `'client'` sorts in-browser; `'emit'` only fires `sort-change` and
 *   lets the parent re-fetch / re-order `rows`.
 */
export interface TableSortConfig {
  field?: string | string[]
  order?: TableSortType | TableSortType[]
  multiple?: boolean
  must?: boolean
  mode?: TableSortMode
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

/**
 * Multi-part pass-through for the Table compound component.
 * Each key targets a specific DOM part; values are merged onto the corresponding
 * element's attributes (class/style are merged, other keys overwrite).
 */
export interface TablePassThrough {
  /** Outermost `.m-table` wrapper. */
  root?: PassThroughPart
  /** Scrollbar wrapper (the horizontal/vertical scroll container). */
  scrollbar?: PassThroughPart
  /** `<thead>` element. */
  thead?: PassThroughPart
  /** `<tbody>` element. */
  tbody?: PassThroughPart
  /** `<tfoot>` element when `showFooter`. */
  tfoot?: PassThroughPart
  /** Pagination footer wrapper (`.m-table__footer`). */
  pagination?: PassThroughPart
  /** Empty-state message container. */
  emptyMessage?: PassThroughPart
}

export interface TableProps {
  pt?: TablePassThrough
  columns: TableColumnDefinition[]
  rows: TableItem[]
  selection?: TableItem[] | null
  selectionMode?: 'multiple' | 'single' | null
  selectedItem?: TableItem | null
  serverOptions?: TableServerOptions | null
  serverTotal?: number
  /** Unified sort configuration. */
  sortConfig?: TableSortConfig | null
  /** Structured filter conditions applied client-side (e.g. `{ field, comparison: '>', criteria: 18 }`). */
  filterOptions?: TableFilterOption[] | null
  /** Active column filters (v-model capable). */
  filterModel?: Record<string, unknown> | null
  searchField?: string | string[]
  searchValue?: string
  rowsPerPage?: number
  pageSizes?: number[]
  page?: number
  paginator?: boolean
  loading?: boolean
  /**
   * When true with `loading`, render skeleton rows inside the table body instead
   * of the overlay spinner. Useful for initial page loads where the spinner
   * would cover the whole table.
   */
  skeleton?: boolean
  /** Number of skeleton rows to render while `skeleton && loading`. Defaults to 5. */
  skeletonRows?: number
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
  /**
   * When true with `virtual`, row heights are measured via ResizeObserver and
   * cached per row. Use when rows have varying heights (e.g. wrapped text).
   * `virtualRowHeight` is still used as an estimate for unmeasured rows.
   */
  virtualDynamicRowHeight?: boolean
  hiddenColumns?: string[] | null
  columnOrder?: string[] | null
  /**
   * Render a gear button above the table that opens a column-visibility panel.
   * Toggling writes to `hiddenColumns` (v-model capable).
   */
  columnSetting?: boolean
  /**
   * Enable header drag-to-reorder. Dropping a column onto another writes the new
   * leaf-column order to `columnOrder` (v-model capable).
   */
  columnDrag?: boolean
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
  /** Fired when a row's expanded state changes (detail expand or tree expand). */
  (event: 'expand-change', payload: { row: TableItem; expanded: boolean }): void
  /** Fired when sort state changes (single- or multi-column). */
  (event: 'sort-change', payload: TableSortPayload): void
  /** Fired when column filter state changes. */
  (event: 'filter-change', filters: Record<string, unknown> | null): void
  (event: 'update:selection', value: TableItem[]): void
  (event: 'update:selectedItem', value: TableItem | null): void
  (event: 'update:serverOptions', value: TableServerOptions): void
  (event: 'update:currentRowKey', value: string | number | null): void
  (event: 'current-change', item: TableItem | null, oldItem: TableItem | null): void
  (event: 'update:page', value: number): void
  (event: 'update:expandedRowKeys', value: Array<string | number>): void
  (event: 'update:filterModel', value: Record<string, unknown> | null): void
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
