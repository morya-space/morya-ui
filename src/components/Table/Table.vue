<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { formatLocale, useWdLocale } from '../../locale'
import { useWdConfig } from '../../shared/config'
import { resolveSizeClass } from '../../shared/types'
import WdCheckbox from '../Checkbox/Checkbox.vue'
import WdPagination from '../Pagination/Pagination.vue'
import WdProgressSpinner from '../ProgressSpinner/ProgressSpinner.vue'
import WdIcon from '../Icon/Icon.vue'
import { computeColumnLayout, computeFixedOffsets, TABLE_SELECTION_WIDTH } from './layout'
import type {
  TableColumn,
  TableEmits,
  TableFilters,
  TableProps,
  TableSortOrder,
} from './types'

const props = withDefaults(defineProps<TableProps>(), {
  rowKey: 'id',
  emptyText: undefined,
  loading: false,
  loadingText: undefined,
  sortMode: 'client',
  fit: true,
  striped: false,
  bordered: false,
  highlightCurrent: false,
  rowHover: true,
  filters: () => ({}),
  paginator: false,
  rowsPerPage: 10,
  page: 1,
})

const emit = defineEmits<TableEmits>()
const config = useWdConfig()
const locale = useWdLocale()
const sizeClass = computed(() => resolveSizeClass(props.size ?? config.value.size))
const resolvedEmptyText = computed(
  () => props.emptyText ?? locale.value.emptyMessage,
)
const resolvedLoadingText = computed(
  () => props.loadingText ?? locale.value.loading,
)

const innerField = ref<string | undefined>(props.sortField)
const innerOrder = ref<TableSortOrder>(normalizeOrder(props.sortOrder))
const innerFilters = ref<TableFilters>({ ...props.filters })
const innerPage = ref(props.page)
const currentRowKey = ref<string | number | null>(null)
const filterOpenKey = ref<string | null>(null)

watch(() => props.sortField, (value) => { innerField.value = value })
watch(() => props.sortOrder, (value) => { innerOrder.value = normalizeOrder(value) })
watch(() => props.filters, (value) => { innerFilters.value = { ...value } }, { deep: true })
watch(() => props.page, (value) => { innerPage.value = value })

function normalizeOrder(order: TableSortOrder | undefined): TableSortOrder {
  if (order === 1 || order === 'asc') return 'asc'
  if (order === -1 || order === 'desc') return 'desc'
  return null
}

function orderToSign(order: TableSortOrder): number {
  if (order === 'asc' || order === 1) return 1
  if (order === 'desc' || order === -1) return -1
  return 0
}

function rowIdentity(row: Record<string, unknown>, index: number) {
  return row[props.rowKey] ?? index
}

const scrollRef = ref<HTMLElement | null>(null)
const containerWidth = ref(0)
let resizeObserver: ResizeObserver | null = null

onMounted(() => {
  const el = scrollRef.value
  if (!el) return
  const measure = () => {
    containerWidth.value = el.clientWidth
  }
  measure()
  resizeObserver = new ResizeObserver(measure)
  resizeObserver.observe(el)
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  resizeObserver = null
})

const layout = computed(() =>
  computeColumnLayout(props.columns, containerWidth.value || 0, {
    fit: props.fit,
    selection: Boolean(props.selectionMode),
  }),
)

const layoutByKey = computed(() => {
  const map = new Map(layout.value.columns.map((column) => [column.key, column]))
  return map
})

const fixedOffsets = computed(() => computeFixedOffsets(layout.value.columns))

const tableStyle = computed(() => {
  if (!layout.value.scrollX) return undefined
  return { width: `${layout.value.bodyWidth}px`, minWidth: '100%' }
})

function columnStyle(column: TableColumn) {
  const layoutColumn = layoutByKey.value.get(column.key)
  const width = layoutColumn?.realWidth
  const style: Record<string, string> = {}
  if (width != null) {
    style.width = `${width}px`
    style.minWidth = `${width}px`
  }
  if (column.fixed === 'left') {
    const left = fixedOffsets.value.left[column.key]
    if (left != null) style.left = `${left}px`
  }
  if (column.fixed === 'right') {
    const right = fixedOffsets.value.right[column.key]
    if (right != null) style.right = `${right}px`
  }
  return Object.keys(style).length ? style : undefined
}

function selectionStyle() {
  const left = fixedOffsets.value.left.__selection__
  return {
    width: `${TABLE_SELECTION_WIDTH}px`,
    minWidth: `${TABLE_SELECTION_WIDTH}px`,
    left: left != null ? `${left}px` : '0',
  }
}

const filteredRows = computed(() => {
  const entries = Object.entries(innerFilters.value).filter(([, value]) => value != null && value !== '')
  if (!entries.length) return props.rows
  return props.rows.filter((row) =>
    entries.every(([key, value]) => {
      const cell = row[key]
      if (typeof value === 'string') return String(cell ?? '').toLowerCase().includes(value.toLowerCase())
      return cell === value
    }),
  )
})

const sortedRows = computed(() => {
  const field = innerField.value
  const sign = orderToSign(innerOrder.value)
  if (props.sortMode === 'emit' || !field || !sign) return filteredRows.value
  return [...filteredRows.value].sort((a, b) => {
    const left = a[field]
    const right = b[field]
    if (left == null && right == null) return 0
    if (left == null) return -1 * sign
    if (right == null) return 1 * sign
    if (typeof left === 'number' && typeof right === 'number') return (left - right) * sign
    return String(left).localeCompare(String(right), undefined, { numeric: true }) * sign
  })
})

const pageCountRows = computed(() => sortedRows.value.length)

const displayRows = computed(() => {
  if (!props.paginator) return sortedRows.value
  const size = props.rowsPerPage
  const start = (innerPage.value - 1) * size
  return sortedRows.value.slice(start, start + size)
})

const showEmpty = computed(() => !props.loading && displayRows.value.length === 0)
const colSpan = computed(() => props.columns.length + (props.selectionMode ? 1 : 0))

const selectionList = computed(() => {
  if (!props.selectionMode) return [] as Record<string, unknown>[]
  if (props.selectionMode === 'multiple') {
    return Array.isArray(props.selection) ? props.selection : []
  }
  return props.selection && !Array.isArray(props.selection) ? [props.selection] : []
})

const allPageSelected = computed(() => {
  if (props.selectionMode !== 'multiple' || !displayRows.value.length) return false
  return displayRows.value.every((row, index) =>
    selectionList.value.some((item) => rowIdentity(item, -1) === rowIdentity(row, index)),
  )
})

function isSelected(row: Record<string, unknown>, index: number) {
  const id = rowIdentity(row, index)
  return selectionList.value.some((item) => rowIdentity(item, -1) === id)
}

function toggleRowSelection(row: Record<string, unknown>, index: number) {
  if (!props.selectionMode) return
  if (props.selectionMode === 'single') {
    const next = isSelected(row, index) ? null : row
    emit('update:selection', next)
    return
  }
  const id = rowIdentity(row, index)
  const exists = selectionList.value.some((item) => rowIdentity(item, -1) === id)
  const next = exists
    ? selectionList.value.filter((item) => rowIdentity(item, -1) !== id)
    : [...selectionList.value, row]
  emit('update:selection', next)
}

function toggleAllPage() {
  if (props.selectionMode !== 'multiple') return
  if (allPageSelected.value) {
    const pageIds = new Set(displayRows.value.map((row, index) => rowIdentity(row, index)))
    emit(
      'update:selection',
      selectionList.value.filter((item) => !pageIds.has(rowIdentity(item, -1))),
    )
  } else {
    const map = new Map(selectionList.value.map((item) => [rowIdentity(item, -1), item]))
    displayRows.value.forEach((row, index) => map.set(rowIdentity(row, index), row))
    emit('update:selection', [...map.values()])
  }
}

function toggleSort(columnKey: string, sortable?: boolean) {
  if (!sortable) return
  let nextField: string | undefined = columnKey
  let nextOrder: TableSortOrder = 'asc'
  if (innerField.value === columnKey) {
    if (innerOrder.value === 'asc') nextOrder = 'desc'
    else if (innerOrder.value === 'desc') {
      nextField = undefined
      nextOrder = null
    }
  }
  innerField.value = nextField
  innerOrder.value = nextOrder
  emit('update:sortField', nextField)
  emit('update:sortOrder', nextOrder)
  emit('sort', { sortField: nextField, sortOrder: nextOrder })
}

function sortIndicator(columnKey: string) {
  if (innerField.value !== columnKey) return '↕'
  if (innerOrder.value === 'asc') return '↑'
  if (innerOrder.value === 'desc') return '↓'
  return '↕'
}

function setFilter(key: string, value: string | number | boolean | null) {
  const next = { ...innerFilters.value, [key]: value === '' ? undefined : value }
  if (next[key] == null) delete next[key]
  innerFilters.value = next
  emit('update:filters', next)
  emit('filter', next)
  innerPage.value = 1
  emit('update:page', 1)
  emit('page', 1)
}

function onPage(page: number) {
  innerPage.value = page
  emit('update:page', page)
  emit('page', page)
}

function onRowClick(row: Record<string, unknown>, index: number) {
  emit('row-click', { row, index })
  if (props.highlightCurrent) {
    currentRowKey.value = rowIdentity(row, index) as string | number
    emit('current-change', row)
  }
}

function fixedClass(column: TableColumn) {
  if (!column.fixed) return undefined
  return `wd-table__cell--fixed-${column.fixed}`
}
</script>

<template>
  <div
    class="wd-table-wrapper"
    :class="[
      {
        'wd-table-wrapper--loading': loading,
        'wd-table-wrapper--bordered': bordered,
        'wd-table-wrapper--striped': striped,
        'wd-table-wrapper--row-hover': rowHover,
      },
    ]"
  >
    <div
      ref="scrollRef"
      class="wd-table-scroll"
      :class="{ 'wd-table-scroll--x': layout.scrollX }"
    >
      <table
        class="wd-table"
        :class="`wd-table--${sizeClass}`"
        :style="tableStyle"
      >
        <colgroup>
          <col
            v-for="column in layout.columns"
            :key="column.key"
            :style="{ width: `${column.realWidth}px` }"
          >
        </colgroup>
        <thead>
          <tr>
            <th
              v-if="selectionMode"
              class="wd-table__selection wd-table__cell--fixed-left"
              scope="col"
              :style="selectionStyle()"
            >
              <WdCheckbox
                v-if="selectionMode === 'multiple'"
                :model-value="allPageSelected"
                :aria-label="locale.selectAllPage"
                @update:model-value="toggleAllPage"
              />
            </th>
            <th
              v-for="column in columns"
              :key="column.key"
              scope="col"
              :class="[
                `wd-table__cell--${column.align ?? 'start'}`,
                fixedClass(column),
                { 'wd-table__th--sortable': column.sortable },
              ]"
              :style="columnStyle(column)"
              :aria-sort="
                column.sortable && innerField === column.key
                  ? innerOrder === 'asc'
                    ? 'ascending'
                    : innerOrder === 'desc'
                      ? 'descending'
                      : 'none'
                  : column.sortable
                    ? 'none'
                    : undefined
              "
            >
              <div class="wd-table__th-inner">
                <button
                  v-if="column.sortable"
                  type="button"
                  class="wd-table__sort"
                  @click="toggleSort(column.key, true)"
                >
                  <span>{{ column.label }}</span>
                  <span class="wd-table__sort-icon" aria-hidden="true">{{ sortIndicator(column.key) }}</span>
                </button>
                <span v-else>{{ column.label }}</span>
                <div v-if="column.filterable" class="wd-table__filter">
                  <button
                    type="button"
                    class="wd-table__filter-btn"
                    :aria-expanded="filterOpenKey === column.key"
                    :aria-label="formatLocale(locale.filterColumn, { label: column.label })"
                    @click.stop="filterOpenKey = filterOpenKey === column.key ? null : column.key"
                  >
                    <WdIcon name="filter" size="sm" />
                  </button>
                  <div v-if="filterOpenKey === column.key" class="wd-table__filter-panel" @click.stop>
                    <select
                      v-if="column.filters?.length"
                      class="wd-table__filter-control"
                      :value="String(innerFilters[column.key] ?? '')"
                      @change="setFilter(column.key, ($event.target as HTMLSelectElement).value || null)"
                    >
                      <option value="">{{ locale.filterAll }}</option>
                      <option
                        v-for="option in column.filters"
                        :key="String(option.value)"
                        :value="String(option.value ?? '')"
                      >
                        {{ option.label }}
                      </option>
                    </select>
                    <input
                      v-else
                      class="wd-table__filter-control"
                      type="search"
                      :value="String(innerFilters[column.key] ?? '')"
                      :placeholder="locale.filterOptions"
                      @input="setFilter(column.key, ($event.target as HTMLInputElement).value)"
                    >
                  </div>
                </div>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(row, index) in displayRows"
            :key="String(rowIdentity(row, index))"
            :class="{
              'wd-table__row--selected': isSelected(row, index),
              'wd-table__row--current': highlightCurrent && currentRowKey === rowIdentity(row, index),
            }"
            @click="onRowClick(row, index)"
          >
            <td
              v-if="selectionMode"
              class="wd-table__selection wd-table__cell--fixed-left"
              :style="selectionStyle()"
              @click.stop
            >
              <WdCheckbox
                :model-value="isSelected(row, index)"
                :aria-label="formatLocale(locale.selectRow, { index: index + 1 })"
                @update:model-value="toggleRowSelection(row, index)"
              />
            </td>
            <td
              v-for="column in columns"
              :key="column.key"
              :class="[`wd-table__cell--${column.align ?? 'start'}`, fixedClass(column)]"
              :style="columnStyle(column)"
            >
              <slot :name="`cell-${column.key}`" :row="row" :value="row[column.key]">
                {{ row[column.key] }}
              </slot>
            </td>
          </tr>
          <tr v-if="showEmpty">
            <td class="wd-table__empty" :colspan="colSpan">
              <slot name="empty">
                <div class="wd-table__empty-content">
                  <div class="wd-table__empty-glyph" aria-hidden="true">∅</div>
                  <p class="wd-table__empty-title">{{ resolvedEmptyText }}</p>
                  <p v-if="emptyDescription" class="wd-table__empty-desc">{{ emptyDescription }}</p>
                </div>
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="paginator" class="wd-table__paginator">
      <WdPagination
        :model-value="innerPage"
        :total-records="pageCountRows"
        :rows="rowsPerPage"
        @update:model-value="onPage"
      />
    </div>

    <div
      v-if="loading"
      class="wd-table__loading"
      role="status"
      :aria-label="resolvedLoadingText"
    >
      <slot name="loading">
        <WdProgressSpinner />
        <span class="wd-table__loading-text">{{ resolvedLoadingText }}</span>
      </slot>
    </div>
  </div>
</template>
