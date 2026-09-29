<script setup lang="ts">
import type { HeaderForRender, MultipleSelectStatus } from '../state/internal'
import type {
  TableHeader,
  TableHeaderItemClassName,
  TableTextDirection,
} from '../types'
import { computed, useSlots } from 'vue'
import { useMLocale } from '../../../locale'
import MCheckbox from '../../Checkbox/Checkbox.vue'
import MIcon from '../../Icon/Icon.vue'
import { SYNTHETIC } from '../columns/keys'
import { getFixedDistanceStyle } from '../core/layout'
import TableHeaderFilter from './TableHeaderFilter.vue'

const props = defineProps<{
  rows: HeaderForRender[][]
  headerClassName: string
  headerItemClassName: TableHeaderItemClassName
  headerTextDirection: TableTextDirection
  multiSort: boolean
  multipleSelectStatus: MultipleSelectStatus
  lastFixedColumn: string
  firstRightFixedColumn: string
  fixedColumnsInfos: Array<{ value: string; distance: number; fixed?: boolean | 'left' | 'right' }>
  hasFixedHeaders: boolean
  filterValues: Record<string, unknown> | null
  isMultiSorting: (headerValue: string) => boolean
  getMultiSortNumber: (headerValue: string) => number | false
}>()

const emit = defineEmits<{
  sort: [header: HeaderForRender]
  'toggle-select-all': [checked: boolean | unknown]
  'filter-apply': [columnKey: string, value: unknown]
  'resize-start': [header: HeaderForRender, event: MouseEvent]
}>()

const slots = useSlots()
const locale = useMLocale()

const headerInnerClass = computed(() => [
  'm-table__header-inner',
  `m-table__header-inner--${props.headerTextDirection}`,
])

function headerCellClass(header: HeaderForRender, index: number) {
  const custom = typeof props.headerItemClassName === 'string'
    ? props.headerItemClassName
    : props.headerItemClassName(header as TableHeader, index + 1)
  const isSelectionCell = header.value === SYNTHETIC.checkbox || header.value === SYNTHETIC.radio
  return [
    {
      'm-table__cell--selection': isSelectionCell,
      'm-table__header-cell--sortable': header.sortable,
      'm-table__header-cell--ascending': header.sortable && header.sortType === 'asc',
      'm-table__header-cell--descending': header.sortable && header.sortType === 'desc',
      'm-table__header-cell--shadow': header.value === props.lastFixedColumn,
      'm-table__header-cell--shadow-end': header.value === props.firstRightFixedColumn,
      'm-table__header-cell--filterable': header.filterable,
    },
    custom,
  ]
}

function getAriaSort(header: HeaderForRender): 'ascending' | 'descending' | 'none' | undefined {
  if (!header.sortable) return undefined
  if (header.sortType === 'asc') return 'ascending'
  if (header.sortType === 'desc') return 'descending'
  return 'none'
}

function onSortHeaderClick(header: HeaderForRender) {
  if (header.sortable && header.sortType) emit('sort', header)
}

function onSortHeaderKeydown(header: HeaderForRender, event: KeyboardEvent) {
  if (event.key !== 'Enter' && event.key !== ' ') return
  event.preventDefault()
  onSortHeaderClick(header)
}

function fixedStyle(column: string) {
  return getFixedDistanceStyle(column, 'th', props.fixedColumnsInfos, props.hasFixedHeaders)
}
</script>

<template>
  <thead
    class="m-table__header"
    :class="[headerClassName]"
  >
    <tr
      v-for="(row, rowIndex) in rows"
      :key="rowIndex"
    >
      <th
        v-for="(header, index) in row"
        :key="`${header.value}-${index}`"
        :class="headerCellClass(header, index)"
        :style="fixedStyle(header.value)"
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
            @update:model-value="emit('toggle-select-all', $event)"
            @click.stop
          />
        </div>
        <div
          v-else-if="header.value === SYNTHETIC.radio"
          class="m-table__cell-inner m-table__cell-inner--selection"
          role="columnheader"
          :aria-label="locale.selectOption"
        />
        <span
          v-else
          :class="headerInnerClass"
        >
          <slot
            v-if="slots[`header-${header.value}`]"
            :name="`header-${header.value}`"
            v-bind="header"
          />
          <slot
            v-else-if="slots.header"
            name="header"
            v-bind="header"
          />
          <span
            v-else
            class="m-table__header-text"
            :title="header.text"
          >{{ header.text }}</span>
          <span
            v-if="header.sortable"
            class="m-table__sort"
            aria-hidden="true"
          >
            <MIcon
              name="triangle-up"
              class="m-table__sort-icon m-table__sort-icon--ascending"
            />
            <MIcon
              name="triangle-down"
              class="m-table__sort-icon m-table__sort-icon--descending"
            />
          </span>
          <span
            v-if="multiSort && isMultiSorting(header.value)"
            class="m-table__multi-sort-number"
          >
            {{ getMultiSortNumber(header.value) }}
          </span>
          <TableHeaderFilter
            v-if="header.filterable"
            :column-key="header.value"
            :label="header.text"
            :filters="header.filters"
            :model-value="filterValues?.[header.value]"
            @apply="(value) => emit('filter-apply', header.value, value)"
            @clear="emit('filter-apply', header.value, null)"
          />
        </span>
        <span
          v-if="header.resizable"
          class="m-table__resize-handle"
          @mousedown="emit('resize-start', header, $event)"
          @click.stop
        />
      </th>
    </tr>
  </thead>
</template>
