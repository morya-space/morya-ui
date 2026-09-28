<script setup lang="ts">

import type { ScrollbarInstance } from '../Scrollbar/types'
import type { HeaderForRender, TableEmitFn } from './hooks'
import type {
  TableEditChangePayload,
  TableEmits,
  TableHeader,
  TableItem,
  TableProps,
  TableSpanMethodResult,
} from './types'
import { computed, onBeforeUnmount, provide, ref, toRefs, useAttrs, useSlots, watch } from 'vue'
import { useMLocale } from '../../locale'
import { useConfiguredSize } from '../../shared/config'
import { useRootParts } from '../../shared/useComponentAttrs'
import { useControllable } from '../../shared/useControllable'
import MCheckbox from '../Checkbox/Checkbox.vue'
import MIcon from '../Icon/Icon.vue'
import MInput from '../Input/Input.vue'
import MLoading from '../Loading/Loading.vue'
import MPagination from '../Pagination/Pagination.vue'
import MRadio from '../Radio/Radio.vue'
import MScrollbar from '../Scrollbar/Scrollbar.vue'
import MTooltip from '../Tooltip/Tooltip.vue'
import {
  useClickRow,
  useExpandableRow,
  useFixedColumn,
  useHeaders,
  usePageItems,
  usePagination,
  useRows,
  useServerOptions,
  useTotalItems,
  useVirtualRows,
} from './hooks'
import { SYNTHETIC, isSyntheticColumn } from './columns/keys'
import {
  buildHeaderRows,
  normalizeAlign,
  normalizeColumnList,
  resolveSortField,
  resolveSortOrder,
  resolveVisibleColumns,
} from './core/normalize'
import TableHeaderFilter from './render/TableHeaderFilter.vue'
import TableLoadingLine from './render/TableLoadingLine.vue'
import { generateColumnContent, getItemValue, resolveRowKey, sameTableItem } from './core/utils'
defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<TableProps>(), {
  rows: () => [],
  selection: null,
  selectionMode: null,
  selectedItem: null,
  serverOptions: null,
  serverTotal: 0,
  sortField: '',
  sortOrder: 'asc',
  sortMode: 'client',
  multiSort: false,
  mustSort: false,
  filterOptions: null,
  filters: null,
  searchField: '',
  searchValue: '',
  rowsPerPage: 25,
  pageSizes: () => [25, 50, 100],
  page: 1,
  paginator: false,
  loading: false,
  emptyText: undefined,
  emptyDescription: undefined,
  striped: false,
  bordered: false,
  rowHover: true,
  highlightCurrent: false,
  currentRowKey: null,
  showOverflowTooltip: false,
  fit: true,
  showHeader: true,
  maxHeight: null,
  fixedHeader: true,
  tableHeight: null,
  tableMinHeight: 180,
  fill: false,
  showIndex: false,
  showIndexSymbol: '#',
  indexColumnWidth: 60,
  fixedCheckbox: false,
  fixedExpand: false,
  fixedIndex: false,
  expandColumnWidth: 36,
  checkboxColumnWidth: null,
  showRowsPerPage: true,
  expandable: false,
  expandedRowKeys: undefined,
  clickRowToExpand: false,
  headerTextDirection: 'left',
  bodyTextDirection: 'left',
  headerItemClassName: '',
  bodyRowClassName: '',
  bodyExpandRowClassName: '',
  bodyItemClassName: '',
  tableClassName: '',
  headerClassName: '',
  rowKey: 'id',
  ariaLabel: undefined,
  size: undefined,
  columnWidths: null,
  virtual: false,
  virtualRowHeight: 40,
  hiddenColumns: null,
  columnOrder: null,
  showFooter: false,
  footerMethod: null,
  spanMethod: null,
  editConfig: null,
})

const emit = defineEmits<TableEmits>()
const attrs = useAttrs()
const { rootAttrs } = useRootParts(attrs, () => props.pt)

const tableEmit: TableEmitFn = (event, ...args) => {
  ;(emit as (event: string, ...args: unknown[]) => void)(event, ...args)
}

const { value: activeFilters, setValue: setActiveFilters } = useControllable<
  Record<string, unknown> | null
>(
  {
    controlled: () => props.filters ?? undefined,
    defaultValue: null,
  },
  (next) => {
    emit('filter', next)
    emit('update:filters', next)
  },
)

const { value: activeColumnWidths, setValue: setActiveColumnWidths } = useControllable<
  Record<string, number> | null
>(
  {
    controlled: () => props.columnWidths ?? undefined,
    defaultValue: null,
  },
  (next) => {
    emit('update:columnWidths', next ?? {})
  },
)

const { value: activeHiddenColumns, setValue: setActiveHiddenColumns } = useControllable<
  string[] | null
>(
  {
    controlled: () => props.hiddenColumns ?? undefined,
    defaultValue: null,
  },
  (next) => {
    emit('update:hiddenColumns', next ?? [])
  },
)

const { value: activeColumnOrder, setValue: setActiveColumnOrder } = useControllable<
  string[] | null
>(
  {
    controlled: () => props.columnOrder ?? undefined,
    defaultValue: null,
  },
  (next) => {
    emit('update:columnOrder', next ?? [])
  },
)

const locale = useMLocale()
const pageRangeSeparator = ' / '
const {
  bodyTextDirection,
  checkboxColumnWidth,
  expandColumnWidth,
  expandedRowKeys,
  filterOptions,
  fixedCheckbox,
  fixedExpand,
  fixedHeader,
  fixedIndex,
  headerTextDirection,
  indexColumnWidth,
  selectionMode,
  selectedItem,
  loading,
  mustSort,
  multiSort,
  pageSizes,
  rowsPerPage,
  searchField,
  searchValue,
  serverTotal,
  serverOptions,
  showIndex,
  sortMode,
  tableHeight,
  tableMinHeight,
  fill,
  showIndexSymbol,
  headerItemClassName,
  bodyRowClassName,
  bodyExpandRowClassName,
  bodyItemClassName,
  tableClassName,
  headerClassName,
  showRowsPerPage,
  clickRowToExpand,
  expandable,
  emptyDescription,
  fit,
  emptyText,
  showHeader,
  maxHeight,
  paginator,
  rowKey,
  ariaLabel,
  size,
  virtual,
  virtualRowHeight,
  showFooter,
  footerMethod,
  spanMethod,
  editConfig,
} = toRefs(props)

const visibleColumnDefs = computed(() =>
  resolveVisibleColumns(props.columns, {
    hiddenColumns: activeHiddenColumns.value,
    columnOrder: activeColumnOrder.value,
    columnWidths: activeColumnWidths.value,
  }),
)

const headers = computed(() => normalizeColumnList(visibleColumnDefs.value))

const headerRows = computed(() => buildHeaderRows(visibleColumnDefs.value))

const items = computed(() => props.rows)
const itemsSelected = computed(() => props.selection ?? null)
const sortBy = computed(() => resolveSortField(props.sortField))
const sortType = computed(() => resolveSortOrder(props.sortOrder))
const currentPage = computed(() => props.page ?? 1)
const resolvedStriped = computed(() => props.striped)
const resolvedBorderCell = computed(() => props.bordered)
const resolvedHighlightCurrentRow = computed(() => props.highlightCurrent)
const resolvedNoHover = computed(() => !props.rowHover)

const sizeTone = useConfiguredSize('Table', () => size.value)
const sizeClass = computed(() => {
  if (sizeTone.value === 'small') return 'm-table--small'
  if (sizeTone.value === 'large') return 'm-table--large'
  return undefined
})

const tableRootClass = computed(() => [
  tableClassName.value,
  sizeClass.value,
  {
    'm-table--border': resolvedBorderCell.value,
    'm-table--striped': resolvedStriped.value,
    'm-table--enable-row-hover': !resolvedNoHover.value,
    'm-table--fill': fill.value && !resolvedTableHeight.value,
    'm-table--virtual': virtualEnabled.value,
  },
])

const useTableFixedLayout = computed(() => fixedHeaders.value.length > 0 || fit.value !== false)

const resolvedEmptyMessage = computed(
  () => emptyText.value ?? locale.value.emptyMessage,
)

const resolvedTableHeight = computed(() => maxHeight.value ?? tableHeight.value)

const tableFillsParent = computed(() => fill.value && !resolvedTableHeight.value)
const tableHeightPx = computed(() => {
  if (resolvedTableHeight.value) return `${resolvedTableHeight.value}px`
  if (tableFillsParent.value) return '100%'
  return null
})
const tableMinHeightPx = computed(() => `${tableMinHeight.value}px`)

const slots = useSlots()
const ifHasPaginationSlot = computed(() => !!slots.pagination)
const ifHasLoadingSlot = computed(() => !!slots.loading)
const ifHasExpandSlot = computed(() => expandable.value || !!slots.expansion)
const ifHasBodySlot = computed(() => !!slots.body)
const ifHasFooterSlot = computed(() => !!slots.footer)

const columnRenderMap = computed(() => {
  const map = new Map<string, (row: TableItem) => unknown>()
  for (const header of headers.value) {
    if (header.render) map.set(header.value, header.render)
  }
  return map
})

const columnAlignMap = computed(() => {
  const map = new Map<string, 'start' | 'center' | 'end'>()
  for (const header of headers.value) {
    const align = normalizeAlign(header.align)
    if (align) map.set(header.value, align)
  }
  return map
})

const dataTable = ref<HTMLElement>()
const scrollbarRef = ref<ScrollbarInstance>()
provide('dataTable', dataTable)

const showShadow = ref(false)
const showShadowEnd = ref(false)
const internalCurrentRowKey = ref<string | number | null>(null)
const scrollTop = ref(0)
const viewportHeight = ref(0)

const activeCurrentRowKey = computed(
  () => props.currentRowKey ?? internalCurrentRowKey.value,
)

function onScrollbarScroll(payload: { scrollTop: number; scrollLeft: number }) {
  scrollTop.value = payload.scrollTop
  showShadow.value = payload.scrollLeft > 0
  const wrap = scrollbarRef.value?.wrapRef
  showShadowEnd.value = wrap
    ? wrap.scrollWidth - wrap.clientWidth - wrap.scrollLeft > 1
    : false
  if (wrap) viewportHeight.value = wrap.clientHeight
}

const selectionColumn = computed((): 'checkbox' | 'radio' | null => {
  const mode = selectionMode.value ?? (itemsSelected.value !== null ? 'multiple' : null)
  if (mode === 'multiple') return 'checkbox'
  if (mode === 'single') return 'radio'
  return null
})

const isMultipleSelectable = computed(() => selectionColumn.value === 'checkbox')
const isSingleSelectable = computed(() => selectionColumn.value === 'radio')

const mainWrapClass = computed(() => [
  'm-table__main',
  {
    'm-table__main--fixed-header': fixedHeader.value,
    'm-table__main--fixed-height': Boolean(resolvedTableHeight.value) || tableFillsParent.value,
    'm-table__main--shadow': showShadow.value,
    'm-table__main--shadow-end': showShadowEnd.value,
    'm-table__main--table-fixed': useTableFixedLayout.value,
    'm-table__main--border-cell': resolvedBorderCell.value,
  },
])

const scrollbarWrapStyle = computed(() => ({
  minHeight: tableMinHeightPx.value,
}))
const isServerSideMode = computed(() => serverOptions.value !== null)

const {
  serverOptionsComputed,
  updateServerOptionsPage,
  updateServerOptionsSort,
  updateServerOptionsRowsPerPage,
} = useServerOptions(serverOptions, multiSort, tableEmit)

const {
  clientSortOptions,
  headerColumns,
  headersForRender,
  updateSortField,
  isMultiSorting,
  getMultiSortNumber,
} = useHeaders(
  showIndexSymbol,
  checkboxColumnWidth,
  expandColumnWidth,
  fixedCheckbox,
  fixedExpand,
  fixedIndex,
  headers,
  ifHasExpandSlot,
  indexColumnWidth,
  selectionColumn,
  isServerSideMode,
  mustSort,
  serverOptionsComputed,
  showIndex,
  sortBy,
  sortType,
  multiSort,
  sortMode,
  updateServerOptionsSort,
  tableEmit,
)

/** In `emit` sort mode the parent owns sorting — skip client-side sorting entirely. */
const effectiveClientSortOptions = computed(() =>
  sortMode.value === 'emit' ? null : clientSortOptions.value,
)

const { pageSizesComputed, rowsPerPageRef, updateRowsPerPage } = useRows(
  isServerSideMode,
  pageSizes,
  serverOptions,
  rowsPerPage,
)

const {
  totalItems,
  selectItemsComputed,
  totalItemsLength,
  toggleSelectAll,
  toggleSelectItem,
} = useTotalItems(
  effectiveClientSortOptions,
  filterOptions,
  activeFilters,
  isServerSideMode,
  items,
  itemsSelected,
  searchField,
  searchValue,
  serverTotal,
  multiSort,
  rowKey,
  tableEmit,
)

const singleSelectedRowKey = computed(() => {
  if (!selectedItem.value) return null
  const index = totalItems.value.findIndex((row) =>
    sameTableItem(row, selectedItem.value!, rowKey.value),
  )
  return index >= 0 ? resolveRowKey(selectedItem.value, index, rowKey.value) : null
})

const {
  currentPaginationNumber,
  maxPaginationNumber,
  isLastPage,
  isFirstPage,
  nextPage,
  prevPage,
  updatePage,
} = usePagination(
  currentPage,
  isServerSideMode,
  loading,
  totalItemsLength,
  rowsPerPageRef,
  serverOptions,
  updateServerOptionsPage,
)

const {
  currentPageFirstIndex,
  currentPageLastIndex,
  multipleSelectStatus,
  pageItems,
  itemsInPage,
} = usePageItems(
  currentPaginationNumber,
  isMultipleSelectable,
  isServerSideMode,
  items,
  rowsPerPageRef,
  selectItemsComputed,
  showIndex,
  totalItems,
  totalItemsLength,
  rowKey,
)

function onToggleSelectAll(checked: boolean | unknown) {
  toggleSelectAll(Boolean(checked), itemsInPage.value)
}

const prevPageEndIndex = computed(() => {
  if (currentPaginationNumber.value === 0) return 0
  return (currentPaginationNumber.value - 1) * rowsPerPageRef.value
})

const {
  isRowExpanded,
  toggleExpandRow,
} = useExpandableRow(expandedRowKeys, rowKey, prevPageEndIndex, tableEmit)

const { fixedHeaders, lastFixedColumn, firstRightFixedColumn, fixedColumnsInfos } = useFixedColumn(headersForRender)
const { clickRow, dblClickRow } = useClickRow(isMultipleSelectable, showIndex, tableEmit)

const virtualEnabled = computed(
  () =>
    Boolean(virtual.value)
    && !ifHasExpandSlot.value
    && Boolean(resolvedTableHeight.value || tableFillsParent.value),
)

const {
  virtualItems,
  startIndex: virtualStartIndex,
  offsetTop,
  offsetBottom,
} = useVirtualRows(
  virtualEnabled,
  pageItems,
  virtualRowHeight,
  scrollTop,
  viewportHeight,
)

const bodyItems = computed(() => (virtualEnabled.value ? virtualItems.value : pageItems.value))

const footerRows = computed(() => {
  if (!showFooter.value) return [] as Array<Array<string | number | null | undefined>>
  if (ifHasFooterSlot.value) return []
  if (!footerMethod.value) return []
  const leafHeaders = headersForRender.value.filter((header) => !isSyntheticColumn(header.value)
    || header.value === SYNTHETIC.index
    || header.value === SYNTHETIC.checkbox
    || header.value === SYNTHETIC.radio
    || header.value === SYNTHETIC.expand)
  return footerMethod.value({
    columns: leafHeaders as TableHeader[],
    data: totalItems.value,
  })
})

const editingCell = ref<{ rowKey: string | number; column: string } | null>(null)
const editingValue = ref('')

function contextMenuRow(item: TableItem, event: MouseEvent) {
  event.preventDefault()
  emit('row-contextmenu', item, event)
}

function getColStyle(header: HeaderForRender) {
  const source = headers.value.find((item) => item.value === header.value)
  const width = header.width ?? source?.width ?? (fixedHeaders.value.length ? 100 : null)
  if (width && useTableFixedLayout.value) return `width: ${width}px; min-width: ${width}px;`
  const minWidth = header.minWidth ?? source?.minWidth
  if (minWidth && useTableFixedLayout.value) return `min-width: ${minWidth}px;`
  return undefined
}

function getFixedDistance(column: string, type: 'td' | 'th' = 'th') {
  if (!fixedHeaders.value.length) return undefined
  const columnInfo = fixedColumnsInfos.value.find((info) => info.value === column)
  if (columnInfo) {
    const side = columnInfo.fixed === 'right' ? 'right' : 'left'
    return `${side}: ${columnInfo.distance}px;z-index: ${type === 'th' ? 3 : 1};position: sticky;`
  }
  return undefined
}

function headerCellClass(header: HeaderForRender, index: number) {
  const custom = typeof headerItemClassName.value === 'string'
    ? headerItemClassName.value
    : headerItemClassName.value(header as TableHeader, index + 1)
  const isSelectionCell = header.value === SYNTHETIC.checkbox || header.value === SYNTHETIC.radio
  return [
    {
      'm-table__cell--selection': isSelectionCell,
      'm-table__header-cell--sortable': header.sortable,
      'm-table__header-cell--ascending': header.sortable && header.sortType === 'asc',
      'm-table__header-cell--descending': header.sortable && header.sortType === 'desc',
      'm-table__header-cell--shadow': header.value === lastFixedColumn.value,
      'm-table__header-cell--shadow-end': header.value === firstRightFixedColumn.value,
      'm-table__header-cell--filterable': header.filterable,
    },
    custom,
  ]
}

function headerInnerClass() {
  return [
    'm-table__header-inner',
    `m-table__header-inner--${headerTextDirection.value}`,
  ]
}

function cellAlignClass(direction: string) {
  if (direction === 'center') return 'm-table__cell--center'
  if (direction === 'right' || direction === 'end') return 'm-table__cell--right'
  return undefined
}

function resolveCellAlign(column: string) {
  const columnAlign = columnAlignMap.value.get(column)
  if (columnAlign) return cellAlignClass(columnAlign)
  return cellAlignClass(bodyTextDirection.value)
}

function cellSlotProps(column: string, item: TableItem) {
  return {
    row: item,
    item,
    column,
    value: getItemValue(column, item),
  }
}

function columnOverflowTooltip(column: string) {
  if (props.showOverflowTooltip) return true
  const header = headers.value.find((item) => item.value === column)
  return Boolean(header?.showOverflowTooltip)
}

function getAriaSort(header: HeaderForRender): 'ascending' | 'descending' | 'none' | undefined {
  if (!header.sortable) return undefined
  if (header.sortType === 'asc') return 'ascending'
  if (header.sortType === 'desc') return 'descending'
  return 'none'
}

function onSortHeaderClick(header: HeaderForRender) {
  if (header.sortable && header.sortType) {
    updateSortField(header.value, header.sortType)
  }
}

function onSortHeaderKeydown(header: HeaderForRender, event: KeyboardEvent) {
  if (event.key !== 'Enter' && event.key !== ' ') return
  event.preventDefault()
  onSortHeaderClick(header)
}

function getRowKey(item: TableItem, index: number) {
  return resolveRowKey(item, prevPageEndIndex.value + index, rowKey.value)
}

function getBodyRowKey(item: TableItem, index: number) {
  const absoluteIndex = virtualEnabled.value
    ? prevPageEndIndex.value + virtualStartIndex.value + index
    : prevPageEndIndex.value + index
  return resolveRowKey(item, absoluteIndex, rowKey.value)
}

function bodyRowIndex(index: number) {
  return virtualEnabled.value ? virtualStartIndex.value + index : index
}

function isRowSelected(item: TableItem, index: number) {
  if (isMultipleSelectable.value) return Boolean(item[SYNTHETIC.checkbox])
  if (isSingleSelectable.value) return singleSelectedRowKey.value === getBodyRowKey(item, index)
  return false
}

function onSingleSelect(item: TableItem) {
  emit('update:selectedItem', stripSyntheticFields(item))
  emit('select-row', stripSyntheticFields(item))
}

function stripSyntheticFields(item: TableItem): TableItem {
  const next = { ...item }
  delete next[SYNTHETIC.index]
  delete next[SYNTHETIC.checkbox]
  delete next.index
  delete next.checkbox
  return next
}

function onPaginationRowsChange(rows: number) {
  updateRowsPerPage(rows)
}

function isCurrentRow(item: TableItem, index: number) {
  if (!resolvedHighlightCurrentRow.value || activeCurrentRowKey.value == null) return false
  return activeCurrentRowKey.value === getBodyRowKey(item, index)
}

function setCurrentRow(item: TableItem, index: number) {
  if (!resolvedHighlightCurrentRow.value) return
  const nextKey = getBodyRowKey(item, index)
  const oldKey = activeCurrentRowKey.value
  if (oldKey === nextKey) return
  const oldItem = oldKey == null
    ? null
    : pageItems.value.find((row, rowIndex) => getRowKey(row, rowIndex) === oldKey) ?? null
  internalCurrentRowKey.value = nextKey
  emit('update:currentRowKey', nextKey)
  emit('current-change', item, oldItem)
}

function onRowClick(item: TableItem, index: number, event: Event) {
  const absoluteIndex = prevPageEndIndex.value + bodyRowIndex(index)
  clickRow(item, absoluteIndex, event)
  setCurrentRow(item, index)
}

function onRowDblClick(item: TableItem, index: number, event: Event) {
  dblClickRow(item, prevPageEndIndex.value + bodyRowIndex(index), event)
}

function resolveSpan(
  item: TableItem,
  column: string,
  rowIndex: number,
  columnIndex: number,
): { rowspan: number; colspan: number } {
  if (!spanMethod.value) return { rowspan: 1, colspan: 1 }
  const header = headersForRender.value.find((entry) => entry.value === column) as TableHeader | undefined
  const result: TableSpanMethodResult = spanMethod.value({
    row: item,
    column: header ?? { text: column, value: column },
    rowIndex,
    columnIndex,
  })
  if (Array.isArray(result)) {
    return { rowspan: result[0] ?? 1, colspan: result[1] ?? 1 }
  }
  if (result && typeof result === 'object') {
    return {
      rowspan: result.rowspan ?? 1,
      colspan: result.colspan ?? 1,
    }
  }
  return { rowspan: 1, colspan: 1 }
}

function isColumnEditable(column: string) {
  if (!editConfig.value) return false
  if (isSyntheticColumn(column)) return false
  const header = headers.value.find((item) => item.value === column)
  return Boolean(header?.editable)
}

function isEditing(item: TableItem, index: number, column: string) {
  if (!editingCell.value) return false
  return editingCell.value.rowKey === getBodyRowKey(item, index) && editingCell.value.column === column
}

function beginEdit(item: TableItem, index: number, column: string) {
  if (!isColumnEditable(column)) return
  editingCell.value = { rowKey: getBodyRowKey(item, index), column }
  editingValue.value = String(getItemValue(column, item) ?? '')
}

function commitEdit(item: TableItem, index: number, column: string) {
  if (!editingCell.value) return
  const oldValue = getItemValue(column, item)
  const value = editingValue.value
  const payload: TableEditChangePayload = {
    row: stripSyntheticFields(item),
    column,
    value,
    oldValue,
    rowIndex: bodyRowIndex(index),
  }
  editingCell.value = null
  if (value === oldValue || String(oldValue ?? '') === value) return
  emit('edit-change', payload)
}

function cancelEdit() {
  editingCell.value = null
}

function onCellActivate(item: TableItem, index: number, column: string, event: MouseEvent) {
  if (!editConfig.value || !isColumnEditable(column)) return
  const trigger = editConfig.value.trigger ?? 'click'
  if (trigger === 'click' && event.type === 'click') beginEdit(item, index, column)
  if (trigger === 'dblclick' && event.type === 'dblclick') beginEdit(item, index, column)
}

function onHeaderFilterApply(columnKey: string, value: unknown) {
  const next = { ...(activeFilters.value ?? {}) }
  if (value == null || value === '' || (Array.isArray(value) && value.length === 0)) {
    delete next[columnKey]
  } else {
    next[columnKey] = value
  }
  setActiveFilters(Object.keys(next).length ? next : null)
}

function getHeaderFilterValue(columnKey: string) {
  return activeFilters.value?.[columnKey]
}

function enrichHeaderRow(row: TableHeader[]): HeaderForRender[] {
  return row.map((header) => {
    const isGroup = (header.colspan ?? 1) > 1
    const rendered = headersForRender.value.find((item) => item.value === header.value)
    if (!rendered || isGroup) {
      return {
        text: header.text,
        value: header.value,
        width: header.width,
        minWidth: header.minWidth,
        fixed: header.fixed,
        colspan: header.colspan,
        rowspan: header.rowspan,
        sortable: false,
        filterable: false,
        resizable: false,
      }
    }
    return {
      ...rendered,
      colspan: header.colspan,
      rowspan: header.rowspan,
      width: rendered.width ?? header.width,
      minWidth: rendered.minWidth ?? header.minWidth,
    }
  })
}

const displayHeaderRows = computed((): HeaderForRender[][] => {
  if (headerRows.value.length <= 1) {
    return [headersForRender.value]
  }
  const depth = headerRows.value.length
  const [first, ...rest] = headerRows.value
  const synthetic = headersForRender.value
    .filter((header) => isSyntheticColumn(header.value))
    .map((header) => ({
      ...header,
      rowspan: depth,
      colspan: 1,
    }))
  return [[...synthetic, ...enrichHeaderRow(first ?? [])], ...rest.map(enrichHeaderRow)]
})

function cellSpan(
  item: TableItem,
  column: string,
  rowIndex: number,
  columnIndex: number,
) {
  return resolveSpan(item, column, rowIndex, columnIndex)
}

function setEditingValue(value: unknown) {
  editingValue.value = String(value ?? '')
}

// --- column resize ---
const resizing = ref<{ key: string; startX: number; startWidth: number } | null>(null)

function onResizeStart(header: HeaderForRender, event: MouseEvent) {
  if (!header.resizable || isSyntheticColumn(header.value)) return
  event.preventDefault()
  event.stopPropagation()
  const width = header.width
    ?? headers.value.find((item) => item.value === header.value)?.width
    ?? (event.currentTarget as HTMLElement).parentElement?.getBoundingClientRect().width
    ?? 100
  resizing.value = { key: header.value, startX: event.clientX, startWidth: width }
  window.addEventListener('mousemove', onResizeMove)
  window.addEventListener('mouseup', onResizeEnd)
}

function onResizeMove(event: MouseEvent) {
  if (!resizing.value) return
  const header = headers.value.find((item) => item.value === resizing.value!.key)
  const minWidth = header?.minWidth ?? 40
  const nextWidth = Math.max(minWidth, resizing.value.startWidth + (event.clientX - resizing.value.startX))
  setActiveColumnWidths({
    ...(activeColumnWidths.value ?? {}),
    [resizing.value.key]: nextWidth,
  })
}

function onResizeEnd() {
  resizing.value = null
  window.removeEventListener('mousemove', onResizeMove)
  window.removeEventListener('mouseup', onResizeEnd)
}

onBeforeUnmount(() => {
  window.removeEventListener('mousemove', onResizeMove)
  window.removeEventListener('mouseup', onResizeEnd)
})

watch(() => props.currentRowKey, (value) => {
  if (value != null) internalCurrentRowKey.value = value
})

watch(rowsPerPageRef, (value) => {
  if (!isServerSideMode.value) updatePage(1)
  else updateServerOptionsRowsPerPage(value)
})

watch([searchValue, filterOptions, activeFilters], () => {
  if (!isServerSideMode.value) updatePage(1)
})

watch(() => props.filters, (value) => {
  emit('filter', value ?? null)
}, { deep: true })

watch(currentPaginationNumber, (value) => {
  emit('update:page', value)
})

watch(virtualEnabled, (enabled) => {
  if (!enabled) return
  const wrap = scrollbarRef.value?.wrapRef
  if (wrap) viewportHeight.value = wrap.clientHeight
})

defineExpose({
  currentPageFirstIndex,
  currentPageLastIndex,
  clientItemsLength: totalItemsLength,
  maxPaginationNumber,
  currentPaginationNumber,
  isLastPage,
  isFirstPage,
  nextPage,
  prevPage,
  updatePage,
  rowsPerPageOptions: pageSizesComputed,
  rowsPerPageActiveOption: rowsPerPageRef,
  updateRowsPerPageActiveOption: updateRowsPerPage,
  setFilters: setActiveFilters,
  setColumnWidths: setActiveColumnWidths,
  setHiddenColumns: setActiveHiddenColumns,
  setColumnOrder: setActiveColumnOrder,
})
</script>

<template>
  <div
    ref="dataTable"
    v-bind="rootAttrs"
    class="m-table"
    :class="tableRootClass"
  >
    <MLoading :loading="loading" size="sm">
      <MScrollbar
        ref="scrollbarRef"
        class="m-table__scrollbar"
        :height="tableHeightPx || undefined"
        :wrap-style="scrollbarWrapStyle"
        :wrap-class="mainWrapClass"
        noresize
        @scroll="onScrollbarScroll"
      >
        <div class="m-table__surface" :aria-busy="loading || undefined">
          <table
            :aria-label="ariaLabel || undefined"
          >
            <colgroup>
              <col
                v-for="(header, index) in headersForRender"
                :key="index"
                :style="getColStyle(header)"
              >
            </colgroup>
            <slot v-if="slots['customize-headers']" name="customize-headers" />
            <thead
              v-else-if="headersForRender.length && showHeader"
              class="m-table__header"
              :class="[headerClassName]"
            >
              <tr v-for="(row, rowIndex) in displayHeaderRows" :key="rowIndex">
                <th
                  v-for="(header, index) in row"
                  :key="`${header.value}-${index}`"
                  :class="headerCellClass(header, index)"
                  :style="getFixedDistance(header.value)"
                  :colspan="header.colspan || 1"
                  :rowspan="header.rowspan || 1"
                  :aria-sort="getAriaSort(header)"
                  :tabindex="header.sortable ? 0 : undefined"
                  @click.stop="onSortHeaderClick(header)"
                  @keydown="onSortHeaderKeydown(header, $event)"
                >
                  <div
                    v-if="header.value === SYNTHETIC.checkbox"
                    class="m-table__cell-inner m-table__cell-inner--selection"
                  >
                    <MCheckbox
                      :key="multipleSelectStatus"
                      :model-value="multipleSelectStatus === 'allSelected'"
                      :indeterminate="multipleSelectStatus === 'partSelected'"
                      :aria-label="locale.selectAllPage"
                      @update:model-value="onToggleSelectAll"
                      @click.stop
                    />
                  </div>
                  <div
                    v-else-if="header.value === SYNTHETIC.radio"
                    class="m-table__cell-inner m-table__cell-inner--selection"
                    role="columnheader"
                    :aria-label="locale.selectOption"
                  />
                  <span v-else :class="headerInnerClass()">
                    <slot v-if="slots[`header-${header.value}`]" :name="`header-${header.value}`" v-bind="header" />
                    <slot v-else-if="slots.header" name="header" v-bind="header" />
                    <span v-else class="m-table__header-text" :title="header.text">{{ header.text }}</span>
                    <span v-if="header.sortable" class="m-table__sort" aria-hidden="true">
                      <MIcon
                        name="triangle-up"
                        class="m-table__sort-icon m-table__sort-icon--ascending"
                      />
                      <MIcon
                        name="triangle-down"
                        class="m-table__sort-icon m-table__sort-icon--descending"
                      />
                    </span>
                    <span v-if="multiSort && isMultiSorting(header.value)" class="m-table__multi-sort-number">
                      {{ getMultiSortNumber(header.value) }}
                    </span>
                    <TableHeaderFilter
                      v-if="header.filterable"
                      :column-key="header.value"
                      :label="header.text"
                      :filters="header.filters"
                      :model-value="getHeaderFilterValue(header.value)"
                      @apply="(value) => onHeaderFilterApply(header.value, value)"
                      @clear="onHeaderFilterApply(header.value, null)"
                    />
                  </span>
                  <span
                    v-if="header.resizable"
                    class="m-table__resize-handle"
                    @mousedown="onResizeStart(header, $event)"
                    @click.stop
                  />
                </th>
              </tr>
            </thead>
            <slot v-if="ifHasBodySlot" name="body" v-bind="pageItems" />
            <tbody
              v-else-if="headerColumns.length"
              class="m-table__body"
            >
              <slot
                name="body-prepend"
                v-bind="{
                  items: pageItems,
                  pagination: { isFirstPage, isLastPage, currentPaginationNumber, maxPaginationNumber, nextPage, prevPage },
                  headers: headersForRender,
                }"
              />
              <tr
                v-if="virtualEnabled && offsetTop > 0"
                class="m-table__virtual-spacer"
                aria-hidden="true"
              >
                <td
                  :colspan="headersForRender.length"
                  :style="{ height: `${offsetTop}px`, padding: 0, border: 0 }"
                />
              </tr>
              <template v-for="(item, index) in bodyItems" :key="getBodyRowKey(item, index)">
                <tr
                  :class="[
                    {
                      'm-table__row--striped': resolvedStriped && (bodyRowIndex(index) + 1) % 2 === 0,
                      'm-table__row--selected': isRowSelected(item, index),
                      'm-table__row--current': isCurrentRow(item, index),
                    },
                    typeof bodyRowClassName === 'string' ? bodyRowClassName : bodyRowClassName(item, bodyRowIndex(index) + 1),
                  ]"
                  @click="($event) => {
                    onRowClick(item, index, $event)
                    clickRowToExpand && toggleExpandRow(item, bodyRowIndex(index), $event)
                  }"
                  @dblclick="($event) => onRowDblClick(item, index, $event)"
                  @contextmenu="($event) => contextMenuRow(item, $event)"
                >
                  <template v-for="(column, i) in headerColumns" :key="i">
                    <td
                      v-if="cellSpan(item, column, bodyRowIndex(index), i).rowspan > 0 && cellSpan(item, column, bodyRowIndex(index), i).colspan > 0"
                      :style="getFixedDistance(column, 'td')"
                      :rowspan="cellSpan(item, column, bodyRowIndex(index), i).rowspan"
                      :colspan="cellSpan(item, column, bodyRowIndex(index), i).colspan"
                      :class="[
                        {
                          'm-table__cell--shadow': column === lastFixedColumn,
                          'm-table__cell--shadow-end': column === firstRightFixedColumn,
                          'm-table__cell--expand': column === SYNTHETIC.expand,
                          'm-table__cell--selection': column === SYNTHETIC.checkbox || column === SYNTHETIC.radio,
                          'm-table__cell--editing': isEditing(item, index, column),
                        },
                        resolveCellAlign(column),
                        typeof bodyItemClassName === 'string' ? bodyItemClassName : bodyItemClassName(column, bodyRowIndex(index) + 1),
                      ]"
                      @click="(event) => {
                        if (column === SYNTHETIC.expand) toggleExpandRow(item, bodyRowIndex(index), event)
                        else onCellActivate(item, index, column, event)
                      }"
                      @dblclick="(event) => onCellActivate(item, index, column, event)"
                    >
                      <div
                        class="m-table__cell-inner"
                        :class="{
                          'm-table__cell-inner--expand': column === SYNTHETIC.expand,
                          'm-table__cell-inner--selection': column === SYNTHETIC.checkbox || column === SYNTHETIC.radio,
                        }"
                      >
                        <template v-if="isEditing(item, index, column)">
                          <slot
                            v-if="slots[`edit-${column}`]"
                            :name="`edit-${column}`"
                            v-bind="{
                              ...cellSlotProps(column, item),
                              value: editingValue,
                              setValue: setEditingValue,
                              commit: () => commitEdit(item, index, column),
                              cancel: cancelEdit,
                            }"
                          />
                          <MInput
                            v-else
                            v-model="editingValue"
                            size="sm"
                            fluid
                            @keydown.enter.prevent="commitEdit(item, index, column)"
                            @keydown.esc.prevent="cancelEdit"
                            @blur="commitEdit(item, index, column)"
                            @click.stop
                          />
                        </template>
                        <slot
                          v-else-if="slots[`cell-${column}`]"
                          :name="`cell-${column}`"
                          v-bind="cellSlotProps(column, item)"
                        />
                        <slot
                          v-else-if="slots[`cell-${column.toLowerCase()}`]"
                          :name="`cell-${column.toLowerCase()}`"
                          v-bind="cellSlotProps(column, item)"
                        />
                        <template v-else-if="column === SYNTHETIC.expand">
                          <button
                            type="button"
                            class="m-table__expand-btn"
                            :class="{ 'm-table__expand-btn--expanded': isRowExpanded(item, bodyRowIndex(index)) }"
                            :aria-expanded="isRowExpanded(item, bodyRowIndex(index))"
                            :aria-label="isRowExpanded(item, bodyRowIndex(index)) ? locale.collapse : locale.expand"
                            @click.stop="toggleExpandRow(item, bodyRowIndex(index), $event)"
                          >
                            <MIcon name="chevron-right" />
                          </button>
                        </template>
                        <template v-else-if="column === SYNTHETIC.checkbox">
                          <MCheckbox
                            :model-value="Boolean(item[SYNTHETIC.checkbox])"
                            :aria-label="locale.selectRow.replace('{index}', String(currentPageFirstIndex + bodyRowIndex(index)))"
                            @update:model-value="toggleSelectItem(item)"
                            @click.stop
                          />
                        </template>
                        <template v-else-if="column === SYNTHETIC.radio">
                          <MRadio
                            :model-value="singleSelectedRowKey ?? undefined"
                            :value="getBodyRowKey(item, index)"
                            :aria-label="locale.selectRow.replace('{index}', String(currentPageFirstIndex + bodyRowIndex(index)))"
                            @update:model-value="onSingleSelect(item)"
                            @click.stop
                          />
                        </template>
                        <slot
                          v-else-if="slots['body-cell']"
                          name="body-cell"
                          v-bind="{ column, item, row: item, value: getItemValue(column, item) }"
                        />
                        <template v-else-if="columnRenderMap.get(column)">
                          <span class="m-table__cell-text">{{ columnRenderMap.get(column)!(item) }}</span>
                        </template>
                        <MTooltip
                          v-else
                          :content="generateColumnContent(column, item)"
                          :disabled="!columnOverflowTooltip(column)"
                        >
                          <span class="m-table__tooltip-trigger">
                            <span class="m-table__cell-text">{{ generateColumnContent(column, item) }}</span>
                          </span>
                        </MTooltip>
                      </div>
                    </td>
                  </template>
                </tr>
                <tr
                  v-if="ifHasExpandSlot && isRowExpanded(item, bodyRowIndex(index))"
                  :class="[
                    { 'm-table__row--striped': resolvedStriped && (bodyRowIndex(index) + 1) % 2 === 0 },
                    typeof bodyExpandRowClassName === 'string' ? bodyExpandRowClassName : bodyExpandRowClassName(item, bodyRowIndex(index) + 1),
                  ]"
                >
                  <td :colspan="headersForRender.length" class="m-table__cell--expanded">
                    <TableLoadingLine v-if="(item as TableItem).expandLoading" />
                    <slot name="expansion" v-bind="{ row: item }" />
                  </td>
                </tr>
              </template>
              <tr
                v-if="virtualEnabled && offsetBottom > 0"
                class="m-table__virtual-spacer"
                aria-hidden="true"
              >
                <td
                  :colspan="headersForRender.length"
                  :style="{ height: `${offsetBottom}px`, padding: 0, border: 0 }"
                />
              </tr>
              <slot
                name="body-append"
                v-bind="{
                  items: pageItems,
                  pagination: { isFirstPage, isLastPage, currentPaginationNumber, maxPaginationNumber, nextPage, prevPage, updatePage },
                  headers: headersForRender,
                }"
              />
            </tbody>
            <tfoot v-if="showFooter && (ifHasFooterSlot || footerRows.length)" class="m-table__tfoot">
              <slot
                v-if="ifHasFooterSlot"
                name="footer"
                v-bind="{ columns: headersForRender, data: totalItems }"
              />
              <tr v-for="(footerRow, footerIndex) in footerRows" :key="footerIndex">
                <td
                  v-for="(header, cellIndex) in headersForRender"
                  :key="header.value"
                  :class="resolveCellAlign(header.value)"
                  :style="getFixedDistance(header.value, 'td')"
                >
                  <div class="m-table__cell-inner">
                    <span class="m-table__cell-text">{{ footerRow[cellIndex] ?? '' }}</span>
                  </div>
                </td>
              </tr>
            </tfoot>
          </table>

          <div v-if="!pageItems.length && !loading" class="m-table__message" role="status">
            <slot v-if="slots.empty" name="empty" />
            <slot v-else name="empty">
              <p class="m-table__empty-text">
                {{ resolvedEmptyMessage }}
              </p>
              <p v-if="emptyDescription" class="m-table__empty-description">
                {{ emptyDescription }}
              </p>
            </slot>
          </div>
        </div>
      </MScrollbar>
      <template v-if="ifHasLoadingSlot" #indicator>
        <slot name="loading" />
      </template>
    </MLoading>

    <div v-if="paginator" class="m-table__footer">
      <div class="m-table__items-index">
        {{ `${currentPageFirstIndex}–${currentPageLastIndex}` }}
        {{ pageRangeSeparator }} {{ totalItemsLength }}
      </div>
      <slot
        v-if="ifHasPaginationSlot"
        name="pagination"
        v-bind="{ isFirstPage, isLastPage, currentPaginationNumber, maxPaginationNumber, nextPage, prevPage }"
      />
      <MPagination
        v-else
        :model-value="currentPaginationNumber"
        :total-records="totalItemsLength"
        :rows="rowsPerPageRef"
        :page-sizes="pageSizesComputed"
        :show-size-picker="showRowsPerPage"
        :disabled="loading"
        @update:model-value="updatePage"
        @update:rows="onPaginationRowsChange"
      />
    </div>
  </div>
</template>
