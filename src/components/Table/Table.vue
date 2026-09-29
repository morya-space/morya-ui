<script setup lang="ts">

import type { ScrollbarInstance } from '../Scrollbar/types'
import type { HeaderForRender, TableEmitFn } from './hooks'
import type {
  TableEmits,
  TableHeader,
  TableItem,
  TableProps,
} from './types'
import { computed, nextTick, onMounted, provide, ref, toRefs, useAttrs, useSlots, watch } from 'vue'
import { useMLocale } from '../../locale'
import { useConfiguredSize } from '../../shared/config'
import { useRootParts } from '../../shared/useComponentAttrs'
import { useControllable } from '../../shared/useControllable'
import MLoading from '../Loading/Loading.vue'
import MPagination from '../Pagination/Pagination.vue'
import MScrollbar from '../Scrollbar/Scrollbar.vue'
import {
  useClickRow,
  useColumnResize,
  useExpandableRow,
  useFixedColumn,
  useHeaders,
  usePageItems,
  usePagination,
  useRows,
  useServerOptions,
  useTotalItems,
  useTreeRows,
  useVirtualRows,
} from './hooks'
import { M_TABLE_ROOT_KEY, SYNTHETIC, isSyntheticColumn } from './columns/keys'
import {
  buildHeaderRows,
  normalizeAlign,
  normalizeColumnList,
  resolveSortField,
  resolveSortOrder,
  resolveVisibleColumns,
} from './core/normalize'
import {
  getColStyleForHeader,
  getFixedDistanceStyle,
  resolveCellAlignClass,
  useDisplayHeaderRows,
} from './core/layout'
import TableThead from './render/TableThead.vue'
import TableTbody from './render/TableTbody.vue'
import { resolveRowKey, sameTableItem, stripSyntheticFields } from './core/utils'
import {
  collectSubtree,
  computeTreeIndeterminateKeys,
  isRowCheckable,
  syncTreeParentSelection,
  toggleTreeCheckboxSelection,
} from './core/treeSelection'
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
  expandConfig: null,
  treeConfig: null,
  checkboxConfig: null,
  radioConfig: null,
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
  expandConfig,
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
  treeConfig,
  checkboxConfig,
  radioConfig,
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

const sourceRows = computed(() => props.rows)

const {
  treeEnabled,
  treeResolved,
  treeRoots,
  flatRows,
  treeMeta,
  expandedKeys: treeExpandedKeys,
  toggleTreeNode,
  isTreeExpandByRow,
  getTreeExpandRecords,
  setTreeExpand,
  setAllTreeExpand,
  clearTreeExpand,
  toggleTreeExpand,
} = useTreeRows(
  treeConfig,
  sourceRows,
  rowKey,
  expandedRowKeys,
  searchValue,
  searchField,
  tableEmit,
)

/** Tree mode feeds flattened visible rows into the existing query/page pipeline. */
const items = computed(() => (treeEnabled.value ? flatRows.value : props.rows))
const pipelineSearchValue = computed(() => (treeEnabled.value ? '' : searchValue.value))
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
    'm-table--tree': treeEnabled.value,
    'm-table--tree-line': treeEnabled.value && treeResolved.value.showLine,
  },
])

const treeNodeColumn = computed(() => {
  if (!treeEnabled.value) return null as string | null
  if (treeResolved.value.treeNode) return treeResolved.value.treeNode
  return headers.value[0]?.value ?? null
})

const treeRowTrigger = computed(
  () => treeEnabled.value && treeResolved.value.trigger === 'row',
)

const resolvedCheckboxConfig = computed(() => ({
  checkStrictly: checkboxConfig.value?.checkStrictly ?? false,
  checkMethod: checkboxConfig.value?.checkMethod,
  showHeader: checkboxConfig.value?.showHeader !== false,
  checkRowKeys: checkboxConfig.value?.checkRowKeys,
  reserve: checkboxConfig.value?.reserve !== false,
  trigger: checkboxConfig.value?.trigger ?? 'default',
}))

const resolvedRadioConfig = computed(() => ({
  strict: radioConfig.value?.strict !== false,
  checkMethod: radioConfig.value?.checkMethod,
  trigger: radioConfig.value?.trigger ?? 'default',
}))

const treeCascadeSelection = computed(
  () => treeEnabled.value && !resolvedCheckboxConfig.value.checkStrictly,
)

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
/** Detail expansion is disabled while tree mode owns `expandedRowKeys`. */
const ifHasExpandSlot = computed(
  () => !treeEnabled.value && (expandable.value || !!expandConfig.value || !!slots.expansion),
)
const expandableEnabled = ifHasExpandSlot
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
provide(M_TABLE_ROOT_KEY, dataTable)

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
  clearSort,
  isMultiSorting,
  getMultiSortNumber,
} = useHeaders({
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
  emits: tableEmit,
})

/** In `emit` sort mode (or tree mode) the parent owns sorting — skip client-side sorting. */
const effectiveClientSortOptions = computed(() => {
  if (treeEnabled.value) return null
  return sortMode.value === 'emit' ? null : clientSortOptions.value
})

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
  pipelineSearchValue,
  serverTotal,
  multiSort,
  rowKey,
  tableEmit,
)

const indeterminateKeys = computed(() => {
  if (!treeCascadeSelection.value) return new Set<string | number>()
  return computeTreeIndeterminateKeys(
    treeRoots.value,
    selectItemsComputed.value,
    rowKey.value,
    treeResolved.value.childrenField,
    resolvedCheckboxConfig.value.checkMethod,
  )
})

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
  isItemSelected,
} = usePageItems(
  currentPaginationNumber,
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
  if (treeCascadeSelection.value) {
    const key = rowKey.value
    const childrenField = treeResolved.value.childrenField
    const checkMethod = resolvedCheckboxConfig.value.checkMethod
    let next = [...selectItemsComputed.value]
    if (checked) {
      for (const row of itemsInPage.value) {
        const targets = collectSubtree(stripSyntheticFields(row), childrenField)
          .filter((item) => isRowCheckable(item, checkMethod))
          .map(stripSyntheticFields)
        for (const target of targets) {
          if (!next.some((entry) => sameTableItem(entry, target, key))) {
            next.push(target)
          }
        }
      }
      next = syncTreeParentSelection(
        treeRoots.value,
        next,
        key,
        childrenField,
        checkMethod,
      )
      selectItemsComputed.value = next
      tableEmit('select-all')
      return
    }
    for (const row of itemsInPage.value) {
      const targets = collectSubtree(stripSyntheticFields(row), childrenField)
      next = next.filter(
        (entry) => !targets.some((target) => sameTableItem(entry, target, key)),
      )
    }
    next = syncTreeParentSelection(
      treeRoots.value,
      next,
      key,
      childrenField,
      checkMethod,
    )
    selectItemsComputed.value = next
    return
  }
  toggleSelectAll(Boolean(checked), itemsInPage.value)
}

function onToggleSelectItem(item: TableItem) {
  const checkMethod = resolvedCheckboxConfig.value.checkMethod
  if (checkMethod && !checkMethod(item)) return

  if (treeCascadeSelection.value) {
    const { next, selected } = toggleTreeCheckboxSelection({
      selected: selectItemsComputed.value,
      row: item,
      rowKey: rowKey.value,
      childrenField: treeResolved.value.childrenField,
      checkStrictly: false,
      checkMethod,
    })
    const synced = syncTreeParentSelection(
      treeRoots.value,
      next,
      rowKey.value,
      treeResolved.value.childrenField,
      checkMethod,
    )
    selectItemsComputed.value = synced
    tableEmit(selected ? 'select-row' : 'deselect-row', stripSyntheticFields(item))
    return
  }
  toggleSelectItem(item)
}

const prevPageEndIndex = computed(() => {
  if (currentPaginationNumber.value === 0) return 0
  return (currentPaginationNumber.value - 1) * rowsPerPageRef.value
})

const {
  expandResolved,
  isRowExpanded,
  isRowExpandByRow,
  getRowExpandRecords,
  setRowExpand,
  setAllRowExpand,
  clearRowExpand,
  toggleRowExpand,
  toggleExpandRow,
} = useExpandableRow(
  expandedRowKeys,
  rowKey,
  prevPageEndIndex,
  tableEmit,
  expandConfig,
  expandableEnabled,
  totalItems,
)

const detailExpandOnRowClick = computed(
  () =>
    !treeEnabled.value
    && (clickRowToExpand.value || expandResolved.value.trigger === 'row'),
)

const { fixedHeaders, lastFixedColumn, firstRightFixedColumn, fixedColumnsInfos } = useFixedColumn(headersForRender)
const { clickRow, dblClickRow } = useClickRow(tableEmit)

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

const { onResizeStart } = useColumnResize(headers, activeColumnWidths, setActiveColumnWidths)

const displayHeaderRows = useDisplayHeaderRows(headerRows, headersForRender)

function contextMenuRow(item: TableItem, event: MouseEvent) {
  event.preventDefault()
  emit('row-contextmenu', item, event)
}

function getColStyle(header: HeaderForRender) {
  return getColStyleForHeader(
    header,
    headers.value,
    fixedHeaders.value.length,
    useTableFixedLayout.value,
  )
}

function getFixedDistance(column: string, type: 'td' | 'th' = 'th') {
  return getFixedDistanceStyle(
    column,
    type,
    fixedColumnsInfos.value,
    fixedHeaders.value.length > 0,
  )
}

function resolveCellAlign(column: string) {
  return resolveCellAlignClass(column, columnAlignMap.value, bodyTextDirection.value)
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
  const key = getBodyRowKey(item, index)
  if (indeterminateKeys.value.has(key)) return false
  if (isMultipleSelectable.value) return isItemSelected(item)
  if (isSingleSelectable.value) return singleSelectedRowKey.value === key
  return false
}

function isRowIndeterminate(item: TableItem, index: number) {
  return indeterminateKeys.value.has(getBodyRowKey(item, index))
}

function isRowCheckDisabled(item: TableItem) {
  if (isMultipleSelectable.value) {
    const method = resolvedCheckboxConfig.value.checkMethod
    return method ? !method(item) : false
  }
  if (isSingleSelectable.value) {
    const method = resolvedRadioConfig.value.checkMethod
    return method ? !method(item) : false
  }
  return false
}

function onSingleSelect(item: TableItem) {
  if (isRowCheckDisabled(item)) return
  const clean = stripSyntheticFields(item)
  if (
    !resolvedRadioConfig.value.strict
    && selectedItem.value
    && sameTableItem(selectedItem.value, clean, rowKey.value)
  ) {
    emit('update:selectedItem', null)
    emit('deselect-row', clean)
    return
  }
  emit('update:selectedItem', clean)
  emit('select-row', clean)
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
  if (treeRowTrigger.value) {
    void toggleTreeNode(item, bodyRowIndex(index), event)
  }
  if (
    isMultipleSelectable.value
    && resolvedCheckboxConfig.value.trigger === 'row'
  ) {
    onToggleSelectItem(item)
  } else if (
    isSingleSelectable.value
    && resolvedRadioConfig.value.trigger === 'row'
  ) {
    onSingleSelect(item)
  }
}

function onToggleTree(item: TableItem, pageIndex: number, event: Event) {
  void toggleTreeNode(item, pageIndex, event)
}

function bodyTreeMeta(item: TableItem, index: number) {
  return treeMeta.value.get(getBodyRowKey(item, index))
}

function isTreeNodeExpanded(item: TableItem, index: number) {
  return treeExpandedKeys.value.includes(getBodyRowKey(item, index))
}

function onRowDblClick(item: TableItem, index: number, event: Event) {
  dblClickRow(item, prevPageEndIndex.value + bodyRowIndex(index), event)
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

function onSortHeader(header: HeaderForRender) {
  if (header.sortable && header.sortType) {
    updateSortField(header.value, header.sortType)
  }
}

function syncViewportHeight() {
  const wrap = scrollbarRef.value?.wrapRef
  if (wrap) viewportHeight.value = wrap.clientHeight
}

function getCheckboxRecords() {
  return selectItemsComputed.value
}

function setCheckboxRow(rows: TableItem | TableItem[], checked: boolean) {
  const list = Array.isArray(rows) ? rows : [rows]
  for (const row of list) {
    const selected = isItemSelected(row)
    if (selected === checked) continue
    onToggleSelectItem(row)
  }
}

function clearCheckboxRow() {
  selectItemsComputed.value = []
}

function getCheckboxIndeterminateRecords() {
  const keys = indeterminateKeys.value
  if (!keys.size) return [] as TableItem[]
  if (treeEnabled.value) {
    const childrenField = treeResolved.value.childrenField
    const out: TableItem[] = []
    for (const root of treeRoots.value) {
      for (const node of collectSubtree(root, childrenField)) {
        const key = resolveRowKey(node, 0, rowKey.value)
        if (keys.has(key)) out.push(stripSyntheticFields(node))
      }
    }
    return out
  }
  return totalItems.value
    .filter((row, index) => keys.has(resolveRowKey(row, index, rowKey.value)))
    .map(stripSyntheticFields)
}

function isCheckedByCheckboxRow(row: TableItem) {
  return isItemSelected(row)
}

function isAllCheckboxChecked() {
  return multipleSelectStatus.value === 'allSelected'
}

function scrollTo(...args: Parameters<NonNullable<ScrollbarInstance['scrollTo']>>) {
  scrollbarRef.value?.scrollTo(...args)
}

async function scrollToRow(row: TableItem) {
  const key = resolveRowKey(row, 0, rowKey.value)
  const index = totalItems.value.findIndex((item, itemIndex) =>
    resolveRowKey(item, itemIndex, rowKey.value) === key
    || sameTableItem(item, row, rowKey.value),
  )
  if (index < 0) return
  if (!isServerSideMode.value && rowsPerPageRef.value > 0) {
    const page = Math.floor(index / rowsPerPageRef.value) + 1
    if (page !== currentPaginationNumber.value) updatePage(page)
  }
  await nextTick()
  const el = dataTable.value?.querySelector(`[data-row-key="${CSS.escape(String(key))}"]`)
  if (el instanceof HTMLElement) {
    el.scrollIntoView({ block: 'nearest' })
    return
  }
  if (virtualEnabled.value && virtualRowHeight.value) {
    scrollbarRef.value?.setScrollTop(index * virtualRowHeight.value)
  }
}

function clearFilter() {
  setActiveFilters(null)
}

function seedCheckboxRowKeys() {
  const keys = resolvedCheckboxConfig.value.checkRowKeys
  if (!keys?.length) return
  if (props.selection != null) return
  if (selectItemsComputed.value.length > 0) return
  const keySet = new Set(keys)
  let matched: TableItem[]
  if (treeEnabled.value) {
    const childrenField = treeResolved.value.childrenField
    matched = []
    for (const root of treeRoots.value) {
      for (const node of collectSubtree(root, childrenField)) {
        const key = resolveRowKey(node, 0, rowKey.value)
        if (keySet.has(key)) matched.push(stripSyntheticFields(node))
      }
    }
  } else {
    matched = totalItems.value
      .filter((row, index) => keySet.has(resolveRowKey(row, index, rowKey.value)))
      .map(stripSyntheticFields)
  }
  if (matched.length) selectItemsComputed.value = matched
}

onMounted(() => {
  if (virtualEnabled.value) syncViewportHeight()
  seedCheckboxRowKeys()
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

watch(virtualEnabled, async (enabled) => {
  if (!enabled) return
  await nextTick()
  syncViewportHeight()
})

if (import.meta.env.DEV) {
  watch(
    () => virtual.value && ifHasExpandSlot.value,
    (conflict) => {
      if (conflict) {
        console.warn(
          '[MTable] `virtual` is disabled while expandable rows are active (#expansion / expandConfig). Use pagination or disable `virtual`.',
        )
      }
    },
    { immediate: true },
  )
  watch(
    () => virtual.value && !ifHasExpandSlot.value && !resolvedTableHeight.value && !tableFillsParent.value,
    (missingViewport) => {
      if (missingViewport) {
        console.warn(
          '[MTable] `virtual` needs a scroll viewport: set `maxHeight`, `tableHeight`, or `fill`.',
        )
      }
    },
    { immediate: true },
  )
}

const tbodyPagination = computed(() => ({
  isFirstPage: isFirstPage.value,
  isLastPage: isLastPage.value,
  currentPaginationNumber: currentPaginationNumber.value,
  maxPaginationNumber: maxPaginationNumber.value,
  nextPage,
  prevPage,
  updatePage,
}))

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
  // selection
  getCheckboxRecords,
  setCheckboxRow,
  clearCheckboxRow,
  getCheckboxIndeterminateRecords,
  isCheckedByCheckboxRow,
  isAllCheckboxChecked,
  // scroll / query
  scrollTo,
  scrollToRow,
  clearSort,
  clearFilter,
  // detail expand
  setRowExpand,
  setAllRowExpand,
  clearRowExpand,
  toggleRowExpand,
  isRowExpandByRow,
  getRowExpandRecords,
  // tree
  isTreeExpandByRow,
  getTreeExpandRecords,
  setTreeExpand,
  setAllTreeExpand,
  clearTreeExpand,
  toggleTreeExpand,
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
            :role="treeEnabled ? 'treegrid' : undefined"
          >
            <colgroup>
              <col
                v-for="(header, index) in headersForRender"
                :key="index"
                :style="getColStyle(header)"
              >
            </colgroup>
            <slot v-if="slots['customize-headers']" name="customize-headers" />
            <TableThead
              v-else-if="headersForRender.length && showHeader"
              :rows="displayHeaderRows"
              :header-class-name="headerClassName"
              :header-item-class-name="headerItemClassName"
              :header-text-direction="headerTextDirection"
              :multi-sort="multiSort"
              :multiple-select-status="multipleSelectStatus"
              :show-checkbox-header="resolvedCheckboxConfig.showHeader"
              :last-fixed-column="lastFixedColumn"
              :first-right-fixed-column="firstRightFixedColumn"
              :fixed-columns-infos="fixedColumnsInfos"
              :has-fixed-headers="fixedHeaders.length > 0"
              :filter-values="activeFilters"
              :is-multi-sorting="isMultiSorting"
              :get-multi-sort-number="getMultiSortNumber"
              @sort="onSortHeader"
              @toggle-select-all="onToggleSelectAll"
              @filter-apply="onHeaderFilterApply"
              @resize-start="onResizeStart"
            >
              <template
                v-for="(_, name) in slots"
                :key="name"
                #[name]="slotData"
              >
                <slot
                  :name="name"
                  v-bind="slotData ?? {}"
                />
              </template>
            </TableThead>
            <slot
              v-if="ifHasBodySlot"
              name="body"
              v-bind="pageItems"
            />
            <TableTbody
              v-else-if="headerColumns.length"
              :body-items="bodyItems"
              :page-items="pageItems"
              :headers-for-render="headersForRender"
              :header-columns="headerColumns"
              :column-align-map="columnAlignMap"
              :column-render-map="columnRenderMap"
              :body-text-direction="bodyTextDirection"
              :body-row-class-name="bodyRowClassName"
              :body-expand-row-class-name="bodyExpandRowClassName"
              :body-item-class-name="bodyItemClassName"
              :striped="resolvedStriped"
              :last-fixed-column="lastFixedColumn"
              :first-right-fixed-column="firstRightFixedColumn"
              :fixed-columns-infos="fixedColumnsInfos"
              :has-fixed-headers="fixedHeaders.length > 0"
              :span-method="spanMethod"
              :show-overflow-tooltip="props.showOverflowTooltip"
              :headers="headers"
              :virtual-enabled="virtualEnabled"
              :offset-top="offsetTop"
              :offset-bottom="offsetBottom"
              :current-page-first-index="currentPageFirstIndex"
              :single-selected-row-key="singleSelectedRowKey"
              :click-row-to-expand="detailExpandOnRowClick"
              :if-has-expand-slot="ifHasExpandSlot"
              :pagination="tbodyPagination"
              :body-row-index="bodyRowIndex"
              :get-body-row-key="getBodyRowKey"
              :is-row-selected="isRowSelected"
              :is-row-indeterminate="isRowIndeterminate"
              :is-row-check-disabled="isRowCheckDisabled"
              :is-current-row="isCurrentRow"
              :is-row-expanded="isRowExpanded"
              :tree-enabled="treeEnabled"
              :tree-node-column="treeNodeColumn"
              :tree-indent="treeResolved.indent"
              :get-tree-meta="bodyTreeMeta"
              :is-tree-node-expanded="isTreeNodeExpanded"
              @row-click="onRowClick"
              @row-dblclick="onRowDblClick"
              @row-contextmenu="contextMenuRow"
              @toggle-expand="(item, pageIndex, event) => toggleExpandRow(item, pageIndex, event)"
              @toggle-tree="onToggleTree"
              @toggle-select="onToggleSelectItem"
              @single-select="onSingleSelect"
            >
              <template
                v-for="(_, name) in slots"
                :key="name"
                #[name]="slotData"
              >
                <slot
                  :name="name"
                  v-bind="slotData ?? {}"
                />
              </template>
            </TableTbody>
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
