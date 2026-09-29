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
  useCellEdit,
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

const {
  editingValue,
  isEditing,
  commitEdit,
  cancelEdit,
  onCellActivate,
  setEditingValue,
} = useCellEdit({
  editConfig,
  headers,
  getBodyRowKey,
  bodyRowIndex,
  onEditChange: (payload) => emit('edit-change', payload),
})

function isRowSelected(item: TableItem, index: number) {
  if (isMultipleSelectable.value) return isItemSelected(item)
  if (isSingleSelectable.value) return singleSelectedRowKey.value === getBodyRowKey(item, index)
  return false
}

function onSingleSelect(item: TableItem) {
  emit('update:selectedItem', stripSyntheticFields(item))
  emit('select-row', stripSyntheticFields(item))
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

onMounted(() => {
  if (virtualEnabled.value) syncViewportHeight()
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
            <TableThead
              v-else-if="headersForRender.length && showHeader"
              :rows="displayHeaderRows"
              :header-class-name="headerClassName"
              :header-item-class-name="headerItemClassName"
              :header-text-direction="headerTextDirection"
              :multi-sort="multiSort"
              :multiple-select-status="multipleSelectStatus"
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
              :click-row-to-expand="clickRowToExpand"
              :if-has-expand-slot="ifHasExpandSlot"
              :editing-value="editingValue"
              :pagination="tbodyPagination"
              :body-row-index="bodyRowIndex"
              :get-body-row-key="getBodyRowKey"
              :is-row-selected="isRowSelected"
              :is-current-row="isCurrentRow"
              :is-row-expanded="isRowExpanded"
              :is-editing="isEditing"
              @row-click="onRowClick"
              @row-dblclick="onRowDblClick"
              @row-contextmenu="contextMenuRow"
              @toggle-expand="(item, pageIndex, event) => toggleExpandRow(item, pageIndex, event)"
              @cell-activate="onCellActivate"
              @toggle-select="toggleSelectItem"
              @single-select="onSingleSelect"
              @commit-edit="commitEdit"
              @cancel-edit="cancelEdit"
              @update:editing-value="setEditingValue"
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
