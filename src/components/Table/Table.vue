<script setup lang="ts">
import type { TableEmits, TableHeader, TableItem, TableProps } from './types'
import type { HeaderForRender, TableEmitFn } from './hooks'
import {
  computed,
  provide,
  ref,
  toRefs,
  useSlots,
  watch,
} from 'vue'
import { useConfiguredSize } from '../../shared/config'
import { useWiLocale } from '../../locale'
import type { ScrollbarInstance } from '../Scrollbar/types'
import TableLoadingLine from './TableLoadingLine.vue'
import WiCheckbox from '../Checkbox/Checkbox.vue'
import WiIcon from '../Icon/Icon.vue'
import WiPagination from '../Pagination/Pagination.vue'
import WiProgressSpinner from '../ProgressSpinner/ProgressSpinner.vue'
import WiRadio from '../Radio/Radio.vue'
import WiScrollbar from '../Scrollbar/Scrollbar.vue'
import WiTooltip from '../Tooltip/Tooltip.vue'
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
} from './hooks'
import { generateColumnContent, resolveRowKey } from './utils'

const props = withDefaults(defineProps<TableProps>(), {
  itemsSelected: null,
  selectionMode: null,
  selectedItem: null,
  serverOptions: null,
  serverItemsLength: 0,
  sortBy: '',
  sortType: 'asc',
  multiSort: false,
  mustSort: false,
  filterOptions: null,
  searchField: '',
  searchValue: '',
  rowsPerPage: 25,
  rowsItems: () => [25, 50, 100],
  currentPage: 1,
  loading: false,
  emptyMessage: undefined,
  alternating: false,
  stripe: undefined,
  borderCell: false,
  border: false,
  noHover: false,
  highlightCurrentRow: false,
  currentRowKey: null,
  showOverflowTooltip: false,
  fit: true,
  emptyText: undefined,
  showHeader: undefined,
  maxHeight: null,
  fixedHeader: true,
  tableHeight: null,
  tableMinHeight: 180,
  showIndex: false,
  showIndexSymbol: '#',
  indexColumnWidth: 60,
  fixedCheckbox: false,
  fixedExpand: false,
  fixedIndex: false,
  expandColumnWidth: 36,
  checkboxColumnWidth: null,
  hideFooter: false,
  hideHeader: false,
  hideRowsPerPage: false,
  buttonsPagination: false,
  clickRowToExpand: false,
  clickEventType: 'single',
  headerTextDirection: 'left',
  bodyTextDirection: 'left',
  headerItemClassName: '',
  bodyRowClassName: '',
  bodyExpandRowClassName: '',
  bodyItemClassName: '',
  tableClassName: '',
  headerClassName: '',
  rowsPerPageMessage: 'rows per page:',
  rowsOfPageSeparatorMessage: 'of',
  preventContextMenuRow: true,
  tableNodeId: '',
  rowKey: 'id',
  ariaLabel: undefined,
  size: undefined,
})

const emit = defineEmits<TableEmits>()
const tableEmit: TableEmitFn = (event, ...args) => {
  ;(emit as (event: string, ...args: unknown[]) => void)(event, ...args)
}

const locale = useWiLocale()
const {
  tableNodeId,
  clickEventType,
  bodyTextDirection,
  checkboxColumnWidth,
  currentPage,
  expandColumnWidth,
  filterOptions,
  fixedCheckbox,
  fixedExpand,
  fixedHeader,
  fixedIndex,
  headers,
  headerTextDirection,
  indexColumnWidth,
  items,
  itemsSelected,
  selectionMode,
  selectedItem,
  loading,
  mustSort,
  multiSort,
  rowsItems,
  rowsPerPage,
  searchField,
  searchValue,
  serverItemsLength,
  serverOptions,
  showIndex,
  sortBy,
  sortType,
  tableHeight,
  tableMinHeight,
  rowsOfPageSeparatorMessage,
  showIndexSymbol,
  preventContextMenuRow,
  headerItemClassName,
  bodyRowClassName,
  bodyExpandRowClassName,
  bodyItemClassName,
  tableClassName,
  headerClassName,
  rowsPerPageMessage,
  hideFooter,
  hideHeader,
  hideRowsPerPage,
  buttonsPagination,
  clickRowToExpand,
  alternating,
  stripe,
  borderCell,
  border,
  highlightCurrentRow,
  currentRowKey,
  showOverflowTooltip,
  fit,
  emptyText,
  showHeader,
  maxHeight,
  noHover,
  emptyMessage,
  rowKey,
  ariaLabel,
  size,
} = toRefs(props)

const sizeTone = useConfiguredSize('Table', () => size.value)
const sizeClass = computed(() => {
  if (sizeTone.value === 'small') return 'wi-table--small'
  if (sizeTone.value === 'large') return 'wi-table--large'
  return undefined
})

const tableRootClass = computed(() => [
  tableClassName.value,
  sizeClass.value,
  {
    'wi-table--border': resolvedBorderCell.value,
    'wi-table--striped': resolvedStriped.value,
    'wi-table--enable-row-hover': !noHover.value,
  },
])

const useTableFixedLayout = computed(() => fixedHeaders.value.length > 0 || fit.value !== false)

const resolvedEmptyMessage = computed(
  () => emptyMessage.value ?? emptyText.value ?? locale.value.emptyMessage,
)

const resolvedStriped = computed(() => stripe.value ?? alternating.value)
const resolvedBorderCell = computed(() => border.value || borderCell.value)
const showHeaderComputed = computed(() => showHeader.value ?? !hideHeader.value)
const resolvedTableHeight = computed(() => maxHeight.value ?? tableHeight.value)

const tableHeightPx = computed(() => (resolvedTableHeight.value ? `${resolvedTableHeight.value}px` : null))
const tableMinHeightPx = computed(() => `${tableMinHeight.value}px`)

const slots = useSlots()
const ifHasPaginationSlot = computed(() => !!slots.pagination)
const ifHasLoadingSlot = computed(() => !!slots.loading)
const ifHasExpandSlot = computed(() => !!slots.expand)
const ifHasBodySlot = computed(() => !!slots.body)

const dataTable = ref<HTMLElement>()
const scrollbarRef = ref<ScrollbarInstance>()
provide('dataTable', dataTable)

const showShadow = ref(false)
const internalCurrentRowKey = ref<string | number | null>(null)

const activeCurrentRowKey = computed(
  () => currentRowKey.value ?? internalCurrentRowKey.value,
)

function onScrollbarScroll(payload: { scrollTop: number; scrollLeft: number }) {
  showShadow.value = payload.scrollLeft > 0
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
  'wi-table__main',
  {
    'wi-table__main--fixed-header': fixedHeader.value,
    'wi-table__main--fixed-height': Boolean(resolvedTableHeight.value),
    'wi-table__main--shadow': showShadow.value,
    'wi-table__main--table-fixed': useTableFixedLayout.value,
    'wi-table__main--border-cell': resolvedBorderCell.value,
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
  updateServerOptionsSort,
  tableEmit,
)

const { rowsItemsComputed, rowsPerPageRef, updateRowsPerPage } = useRows(
  isServerSideMode,
  rowsItems,
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
  clientSortOptions,
  filterOptions,
  isServerSideMode,
  items,
  itemsSelected,
  searchField,
  searchValue,
  serverItemsLength,
  multiSort,
  tableEmit,
)

const singleSelectedRowKey = computed(() => {
  if (!selectedItem.value) return null
  const index = totalItems.value.findIndex((row) => {
    const clone = { ...row }
    const selected = { ...selectedItem.value! }
    return JSON.stringify(clone) === JSON.stringify(selected)
  })
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
  updateCurrentPaginationNumber,
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
)

const prevPageEndIndex = computed(() => {
  if (currentPaginationNumber.value === 0) return 0
  return (currentPaginationNumber.value - 1) * rowsPerPageRef.value
})

const {
  expandingItemIndexList,
  updateExpandingItemIndexList,
  clearExpandingItemIndexList,
} = useExpandableRow(pageItems, prevPageEndIndex, tableEmit)

const { fixedHeaders, lastFixedColumn, fixedColumnsInfos } = useFixedColumn(headersForRender)
const { clickRow } = useClickRow(clickEventType, isMultipleSelectable, showIndex, tableEmit)

function contextMenuRow(item: TableItem, event: MouseEvent) {
  if (preventContextMenuRow.value) event.preventDefault()
  emit('contextmenuRow', item, event)
}

function getColStyle(header: HeaderForRender) {
  const width = header.width ?? (fixedHeaders.value.length ? 100 : null)
  if (width && useTableFixedLayout.value) return `width: ${width}px; min-width: ${width}px;`
  return undefined
}

function getFixedDistance(column: string, type: 'td' | 'th' = 'th') {
  if (!fixedHeaders.value.length) return undefined
  const columnInfo = fixedColumnsInfos.value.find((info) => info.value === column)
  if (columnInfo) {
    return `left: ${columnInfo.distance}px;z-index: ${type === 'th' ? 3 : 1};position: sticky;`
  }
  return undefined
}

function headerCellClass(header: HeaderForRender, index: number) {
  const custom = typeof headerItemClassName.value === 'string'
    ? headerItemClassName.value
    : headerItemClassName.value(header as TableHeader, index + 1)
  const isSelectionCell = header.text === 'checkbox' || header.value === 'radio'
  return [
    {
      'wi-table__cell--selection': isSelectionCell,
      'wi-table__header-cell--sortable': header.sortable,
      'wi-table__header-cell--ascending': header.sortable && header.sortType === 'asc',
      'wi-table__header-cell--descending': header.sortable && header.sortType === 'desc',
      'wi-table__header-cell--shadow': header.value === lastFixedColumn.value,
    },
    custom,
  ]
}

function headerInnerClass() {
  return [
    'wi-table__header-inner',
    `wi-table__header-inner--${headerTextDirection.value}`,
  ]
}

function cellAlignClass(direction: string) {
  if (direction === 'center') return 'wi-table__cell--center'
  if (direction === 'right') return 'wi-table__cell--right'
  return undefined
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

function isRowSelected(item: TableItem, index: number) {
  if (isMultipleSelectable.value) return Boolean((item as TableItem).checkbox)
  if (isSingleSelectable.value) return singleSelectedRowKey.value === getRowKey(item, index)
  return false
}

function onSingleSelect(item: TableItem) {
  const nextItem = { ...item }
  delete nextItem.index
  emit('update:selectedItem', nextItem)
  emit('selectRow', nextItem)
}

function onPaginationRowsChange(rows: number) {
  updateRowsPerPage(rows)
}

function isCurrentRow(item: TableItem, index: number) {
  if (!highlightCurrentRow.value || activeCurrentRowKey.value == null) return false
  return activeCurrentRowKey.value === getRowKey(item, index)
}

function setCurrentRow(item: TableItem, index: number) {
  if (!highlightCurrentRow.value) return
  const nextKey = getRowKey(item, index)
  const oldKey = activeCurrentRowKey.value
  if (oldKey === nextKey) return
  const oldItem = oldKey == null
    ? null
    : pageItems.value.find((row, rowIndex) => getRowKey(row, rowIndex) === oldKey) ?? null
  internalCurrentRowKey.value = nextKey
  emit('update:currentRowKey', nextKey)
  emit('currentChange', item, oldItem)
}

function onRowClick(item: TableItem, index: number, clickType: 'single' | 'double', event: Event) {
  clickRow(item, clickType, event)
  if (clickType === 'single') setCurrentRow(item, index)
}

watch(currentRowKey, (value) => {
  if (value != null) internalCurrentRowKey.value = value
})

watch(loading, (newVal, oldVal) => {
  if (serverOptionsComputed.value && newVal === false && oldVal === true) {
    updateCurrentPaginationNumber(serverOptionsComputed.value.page)
    clearExpandingItemIndexList()
  }
})

watch(rowsPerPageRef, (value) => {
  if (!isServerSideMode.value) updatePage(1)
  else updateServerOptionsRowsPerPage(value)
})

watch([searchValue, filterOptions], () => {
  if (!isServerSideMode.value) updatePage(1)
})

watch(
  [currentPaginationNumber, clientSortOptions, searchField, searchValue, filterOptions],
  () => clearExpandingItemIndexList(),
  { deep: true },
)

watch(pageItems, (value) => emit('updatePageItems', value), { deep: true })
watch(totalItems, (value) => emit('updateTotalItems', value), { deep: true })

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
  rowsPerPageOptions: rowsItemsComputed,
  rowsPerPageActiveOption: rowsPerPageRef,
  updateRowsPerPageActiveOption: updateRowsPerPage,
})
</script>

<template>
  <div
    ref="dataTable"
    class="wi-table"
    :class="tableRootClass"
    :aria-label="ariaLabel || undefined"
  >
    <WiScrollbar
      ref="scrollbarRef"
      class="wi-table__scrollbar"
      :height="tableHeightPx || undefined"
      :wrap-style="scrollbarWrapStyle"
      :wrap-class="mainWrapClass"
      noresize
      @scroll="onScrollbarScroll"
    >
      <div class="wi-table__surface" :aria-busy="loading || undefined">
      <table :id="tableNodeId || undefined">
        <colgroup>
          <col
            v-for="(header, index) in headersForRender"
            :key="index"
            :style="getColStyle(header)"
          >
        </colgroup>
        <slot v-if="slots['customize-headers']" name="customize-headers" />
        <thead
          v-else-if="headersForRender.length && showHeaderComputed"
          class="wi-table__header"
          :class="[headerClassName]"
        >
          <tr>
            <th
              v-for="(header, index) in headersForRender"
              :key="index"
              :class="headerCellClass(header, index)"
              :style="getFixedDistance(header.value)"
              :aria-sort="getAriaSort(header)"
              :tabindex="header.sortable ? 0 : undefined"
              @click.stop="onSortHeaderClick(header)"
              @keydown="onSortHeaderKeydown(header, $event)"
            >
              <div
                v-if="header.text === 'checkbox'"
                class="wi-table__cell-inner wi-table__cell-inner--selection"
              >
                <WiCheckbox
                  :key="multipleSelectStatus"
                  :model-value="multipleSelectStatus === 'allSelected'"
                  :indeterminate="multipleSelectStatus === 'partSelected'"
                  :aria-label="locale.selectAllPage"
                  @update:model-value="toggleSelectAll"
                  @click.stop
                />
              </div>
              <div
                v-else-if="header.value === 'radio'"
                class="wi-table__cell-inner wi-table__cell-inner--selection"
              />
              <span v-else :class="headerInnerClass()">
                <slot v-if="slots[`header-${header.value}`]" :name="`header-${header.value}`" v-bind="header" />
                <slot v-else-if="slots[`header-${header.value.toLowerCase()}`]" :name="`header-${header.value.toLowerCase()}`" v-bind="header" />
                <slot v-else-if="slots.header" name="header" v-bind="header" />
                <span v-else class="wi-table__header-text" :title="header.text">{{ header.text }}</span>
                <span v-if="header.sortable" class="wi-table__caret-wrapper">
                  <i class="wi-table__sort-caret wi-table__sort-caret--ascending" />
                  <i class="wi-table__sort-caret wi-table__sort-caret--descending" />
                </span>
                <span v-if="multiSort && isMultiSorting(header.value)" class="wi-table__multi-sort-number">
                  {{ getMultiSortNumber(header.value) }}
                </span>
              </span>
            </th>
          </tr>
        </thead>
        <slot v-if="ifHasBodySlot" name="body" v-bind="pageItems" />
        <tbody
          v-else-if="headerColumns.length"
          class="wi-table__body"
        >
          <slot
            name="body-prepend"
            v-bind="{
              items: pageItems,
              pagination: { isFirstPage, isLastPage, currentPaginationNumber, maxPaginationNumber, nextPage, prevPage },
              headers: headersForRender,
            }"
          />
          <template v-for="(item, index) in pageItems" :key="getRowKey(item, index)">
            <tr
              :class="[
                {
                  'wi-table__row--striped': resolvedStriped && (index + 1) % 2 === 0,
                  'wi-table__row--selected': isRowSelected(item, index),
                  'wi-table__row--current': isCurrentRow(item, index),
                },
                typeof bodyRowClassName === 'string' ? bodyRowClassName : bodyRowClassName(item, index + 1),
              ]"
              @click="($event) => {
                onRowClick(item, index, 'single', $event)
                clickRowToExpand && updateExpandingItemIndexList(index + prevPageEndIndex, item, $event)
              }"
              @dblclick="($event) => onRowClick(item, index, 'double', $event)"
              @contextmenu="($event) => contextMenuRow(item, $event)"
            >
              <td
                v-for="(column, i) in headerColumns"
                :key="i"
                :style="getFixedDistance(column, 'td')"
                :class="[
                  {
                    'wi-table__cell--shadow': column === lastFixedColumn,
                    'wi-table__cell--expand': column === 'expand',
                    'wi-table__cell--selection': column === 'checkbox' || column === 'radio',
                  },
                  cellAlignClass(bodyTextDirection),
                  typeof bodyItemClassName === 'string' ? bodyItemClassName : bodyItemClassName(column, index + 1),
                ]"
                @click="column === 'expand' ? updateExpandingItemIndexList(index + prevPageEndIndex, item, $event) : null"
              >
                <div
                  class="wi-table__cell-inner"
                  :class="{
                    'wi-table__cell-inner--expand': column === 'expand',
                    'wi-table__cell-inner--selection': column === 'checkbox' || column === 'radio',
                  }"
                >
                  <slot v-if="slots[`item-${column}`]" :name="`item-${column}`" v-bind="item" />
                  <slot v-else-if="slots[`item-${column.toLowerCase()}`]" :name="`item-${column.toLowerCase()}`" v-bind="item" />
                  <template v-else-if="column === 'expand'">
                    <button
                      type="button"
                      class="wi-table__expand-btn"
                      :class="{ 'wi-table__expand-btn--expanded': expandingItemIndexList.includes(prevPageEndIndex + index) }"
                      :aria-expanded="expandingItemIndexList.includes(prevPageEndIndex + index)"
                      :aria-label="locale.expand"
                      @click.stop="updateExpandingItemIndexList(index + prevPageEndIndex, item, $event)"
                    >
                      <WiIcon name="chevron-right" />
                    </button>
                  </template>
                  <template v-else-if="column === 'checkbox'">
                    <WiCheckbox
                      :model-value="Boolean((item as TableItem).checkbox)"
                      :aria-label="locale.selectRow.replace('{index}', String(currentPageFirstIndex + index))"
                      @update:model-value="toggleSelectItem(item)"
                      @click.stop
                    />
                  </template>
                  <template v-else-if="column === 'radio'">
                    <WiRadio
                      :model-value="singleSelectedRowKey ?? undefined"
                      :value="getRowKey(item, index)"
                      :aria-label="locale.selectRow.replace('{index}', String(currentPageFirstIndex + index))"
                      @update:model-value="onSingleSelect(item)"
                      @click.stop
                    />
                  </template>
                  <slot v-else-if="slots.item" name="item" v-bind="{ column, item }" />
                  <WiTooltip
                    v-else
                    :content="generateColumnContent(column, item)"
                    :disabled="!showOverflowTooltip"
                  >
                    <span class="wi-table__tooltip-trigger">
                      <span class="wi-table__cell-text">{{ generateColumnContent(column, item) }}</span>
                    </span>
                  </WiTooltip>
                </div>
              </td>
            </tr>
            <tr
              v-if="ifHasExpandSlot && expandingItemIndexList.includes(index + prevPageEndIndex)"
              :class="[
                { 'wi-table__row--striped': resolvedStriped && (index + 1) % 2 === 0 },
                typeof bodyExpandRowClassName === 'string' ? bodyExpandRowClassName : bodyExpandRowClassName(item, index + 1),
              ]"
            >
              <td :colspan="headersForRender.length" class="wi-table__cell--expanded">
                <TableLoadingLine v-if="(item as TableItem).expandLoading" class="expand-loading" />
                <slot name="expand" v-bind="item" />
              </td>
            </tr>
          </template>
          <slot
            name="body-append"
            v-bind="{
              items: pageItems,
              pagination: { isFirstPage, isLastPage, currentPaginationNumber, maxPaginationNumber, nextPage, prevPage, updatePage },
              headers: headersForRender,
            }"
          />
        </tbody>
      </table>

      <div v-if="loading" class="wi-table__loading">
        <div class="wi-table__loading-mask" />
        <div class="wi-table__loading-body">
          <slot v-if="ifHasLoadingSlot" name="loading" />
          <WiProgressSpinner v-else size="sm" />
        </div>
      </div>

      <div v-if="!pageItems.length && !loading" class="wi-table__message" role="status">
        <slot name="empty-message">
          <p class="wi-table__empty-text">{{ resolvedEmptyMessage }}</p>
        </slot>
      </div>
      </div>
    </WiScrollbar>

    <div v-if="!hideFooter" class="wi-table__footer">
      <div class="wi-table__items-index">
        {{ `${currentPageFirstIndex}–${currentPageLastIndex}` }}
        {{ rowsOfPageSeparatorMessage }} {{ totalItemsLength }}
      </div>
      <slot
        v-if="ifHasPaginationSlot"
        name="pagination"
        v-bind="{ isFirstPage, isLastPage, currentPaginationNumber, maxPaginationNumber, nextPage, prevPage }"
      />
      <WiPagination
        v-else
        :model-value="currentPaginationNumber"
        :total-records="totalItemsLength"
        :rows="rowsPerPageRef"
        :page-sizes="rowsItemsComputed"
        :show-size-picker="!hideRowsPerPage"
        :disabled="loading"
        @update:model-value="updatePage"
        @update:rows="onPaginationRowsChange"
      />
    </div>
  </div>
</template>
