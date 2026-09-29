<script setup lang="ts">
import type { HeaderForRender } from '../state/internal'
import type {
  TableBodyItemClassName,
  TableBodyRowClassName,
  TableItem,
  TableSpanMethod,
  TableTextDirection,
} from '../types'
import type { TableTreeNodeMeta } from '../core/tree'
import { computed, useSlots } from 'vue'
import { useMLocale } from '../../../locale'
import MCheckbox from '../../Checkbox/Checkbox.vue'
import MIcon from '../../Icon/Icon.vue'
import MRadio from '../../Radio/Radio.vue'
import { SYNTHETIC } from '../columns/keys'
import {
  bodyItemClassNameOf,
  buildRowCells,
  getFixedDistanceStyle,
  resolveCellAlignClass,
} from '../core/layout'
import { getItemValue } from '../core/utils'
import TableDefaultCell from './TableDefaultCell.vue'
import TableLoadingLine from './TableLoadingLine.vue'

const props = defineProps<{
  bodyItems: TableItem[]
  pageItems: TableItem[]
  headersForRender: HeaderForRender[]
  headerColumns: string[]
  columnAlignMap: Map<string, 'start' | 'center' | 'end'>
  columnRenderMap: Map<string, (row: TableItem) => unknown>
  bodyTextDirection: TableTextDirection
  bodyRowClassName: TableBodyRowClassName
  bodyExpandRowClassName: TableBodyRowClassName
  bodyItemClassName: TableBodyItemClassName
  striped: boolean
  lastFixedColumn: string
  firstRightFixedColumn: string
  fixedColumnsInfos: Array<{ value: string; distance: number; fixed?: boolean | 'left' | 'right' }>
  hasFixedHeaders: boolean
  spanMethod: TableSpanMethod | null
  showOverflowTooltip: boolean
  headers: Array<{ value: string; showOverflowTooltip?: boolean }>
  virtualEnabled: boolean
  offsetTop: number
  offsetBottom: number
  currentPageFirstIndex: number
  singleSelectedRowKey: string | number | null
  clickRowToExpand: boolean
  ifHasExpandSlot: boolean
  pagination: {
    isFirstPage: boolean
    isLastPage: boolean
    currentPaginationNumber: number
    maxPaginationNumber: number
    nextPage: () => void
    prevPage: () => void
    updatePage?: (page: number) => void
  }
  bodyRowIndex: (index: number) => number
  getBodyRowKey: (item: TableItem, index: number) => string | number
  isRowSelected: (item: TableItem, index: number) => boolean
  isRowIndeterminate?: (item: TableItem, index: number) => boolean
  isRowCheckDisabled?: (item: TableItem) => boolean
  isCurrentRow: (item: TableItem, index: number) => boolean
  isRowExpanded: (item: TableItem, pageIndex: number) => boolean
  treeEnabled?: boolean
  treeNodeColumn?: string | null
  treeIndent?: number
  getTreeMeta?: (item: TableItem, index: number) => TableTreeNodeMeta | undefined
  isTreeNodeExpanded?: (item: TableItem, index: number) => boolean
}>()

const emit = defineEmits<{
  'row-click': [item: TableItem, index: number, event: Event]
  'row-dblclick': [item: TableItem, index: number, event: Event]
  'row-contextmenu': [item: TableItem, event: MouseEvent]
  'toggle-expand': [item: TableItem, pageIndex: number, event: Event]
  'toggle-tree': [item: TableItem, pageIndex: number, event: Event]
  'toggle-select': [item: TableItem]
  'single-select': [item: TableItem]
}>()

const slots = useSlots()
const locale = useMLocale()

const colCount = computed(() => props.headersForRender.length)

function cellAlign(column: string) {
  return resolveCellAlignClass(column, props.columnAlignMap, props.bodyTextDirection)
}

function fixedStyle(column: string) {
  return getFixedDistanceStyle(column, 'td', props.fixedColumnsInfos, props.hasFixedHeaders)
}

function rowCells(item: TableItem, rowIndex: number) {
  return buildRowCells(
    item,
    rowIndex,
    props.headerColumns,
    props.spanMethod,
    props.headersForRender,
  )
}

function columnOverflowTooltip(column: string) {
  if (props.showOverflowTooltip) return true
  const header = props.headers.find((item) => item.value === column)
  return Boolean(header?.showOverflowTooltip)
}

function cellSlotProps(column: string, item: TableItem) {
  return {
    row: item,
    item,
    column,
    value: getItemValue(column, item),
  }
}

function onRowClick(item: TableItem, index: number, event: Event) {
  emit('row-click', item, index, event)
  if (props.clickRowToExpand) {
    emit('toggle-expand', item, props.bodyRowIndex(index), event)
  }
}

function treeMetaOf(item: TableItem, index: number) {
  return props.getTreeMeta?.(item, index)
}

function isTreeColumn(column: string) {
  return Boolean(props.treeEnabled && props.treeNodeColumn && column === props.treeNodeColumn)
}
</script>

<template>
  <tbody class="m-table__body">
    <slot
      name="body-prepend"
      v-bind="{
        items: pageItems,
        pagination,
        headers: headersForRender,
      }"
    />
    <tr
      v-if="virtualEnabled && offsetTop > 0"
      class="m-table__virtual-spacer"
      aria-hidden="true"
    >
      <td
        :colspan="colCount"
        :style="{ height: `${offsetTop}px`, padding: 0, border: 0 }"
      />
    </tr>
    <template
      v-for="(item, index) in bodyItems"
      :key="getBodyRowKey(item, index)"
    >
      <tr
        :class="[
          {
            'm-table__row--striped': striped && (bodyRowIndex(index) + 1) % 2 === 0,
            'm-table__row--selected': isRowSelected(item, index),
            'm-table__row--current': isCurrentRow(item, index),
          },
          typeof bodyRowClassName === 'string' ? bodyRowClassName : bodyRowClassName(item, bodyRowIndex(index) + 1),
        ]"
        :data-row-key="String(getBodyRowKey(item, index))"
        :aria-level="treeEnabled ? (treeMetaOf(item, index)?.depth ?? 0) + 1 : undefined"
        :aria-expanded="treeEnabled && treeMetaOf(item, index)?.hasChildren
          ? isTreeNodeExpanded?.(item, index) ?? false
          : undefined"
        @click="onRowClick(item, index, $event)"
        @dblclick="emit('row-dblclick', item, index, $event)"
        @contextmenu="emit('row-contextmenu', item, $event)"
      >
        <template
          v-for="cell in rowCells(item, bodyRowIndex(index))"
          :key="cell.column"
        >
          <td
            v-if="cell.visible"
            :style="fixedStyle(cell.column)"
            :rowspan="cell.rowspan"
            :colspan="cell.colspan"
            :class="[
              {
                'm-table__cell--shadow': cell.column === lastFixedColumn,
                'm-table__cell--shadow-end': cell.column === firstRightFixedColumn,
                'm-table__cell--expand': cell.column === SYNTHETIC.expand,
                'm-table__cell--selection': cell.column === SYNTHETIC.checkbox || cell.column === SYNTHETIC.radio,
              },
              cellAlign(cell.column),
              bodyItemClassNameOf(bodyItemClassName, cell.column, bodyRowIndex(index) + 1),
            ]"
            @click="(event) => {
              if (cell.column === SYNTHETIC.expand) emit('toggle-expand', item, bodyRowIndex(index), event)
            }"
          >
            <div
              class="m-table__cell-inner"
              :class="{
                'm-table__cell-inner--expand': cell.column === SYNTHETIC.expand,
                'm-table__cell-inner--selection': cell.column === SYNTHETIC.checkbox || cell.column === SYNTHETIC.radio,
              }"
            >
              <div
                v-if="isTreeColumn(cell.column)"
                class="m-table__tree-cell"
                :style="{
                  paddingLeft: `${(treeMetaOf(item, index)?.depth ?? 0) * (treeIndent ?? 16)}px`,
                }"
              >
                <button
                  v-if="treeMetaOf(item, index)?.hasChildren"
                  type="button"
                  class="m-table__tree-toggler"
                  :class="{
                    'm-table__tree-toggler--expanded': isTreeNodeExpanded?.(item, index),
                    'm-table__tree-toggler--loading': treeMetaOf(item, index)?.loading,
                  }"
                  :aria-label="isTreeNodeExpanded?.(item, index) ? locale.collapse : locale.expand"
                  :disabled="treeMetaOf(item, index)?.loading"
                  @click.stop="emit('toggle-tree', item, bodyRowIndex(index), $event)"
                >
                  <MIcon
                    :name="treeMetaOf(item, index)?.loading
                      ? 'loader'
                      : isTreeNodeExpanded?.(item, index) ? 'chevron-down' : 'chevron-right'"
                    size="sm"
                  />
                </button>
                <span v-else class="m-table__tree-toggler-spacer" />
                <slot
                  v-if="slots[`cell-${cell.column}`]"
                  :name="`cell-${cell.column}`"
                  v-bind="cellSlotProps(cell.column, item)"
                />
                <slot
                  v-else-if="slots[`cell-${cell.column.toLowerCase()}`]"
                  :name="`cell-${cell.column.toLowerCase()}`"
                  v-bind="cellSlotProps(cell.column, item)"
                />
                <template v-else-if="columnRenderMap.get(cell.column)">
                  <span class="m-table__cell-text">{{ columnRenderMap.get(cell.column)!(item) }}</span>
                </template>
                <TableDefaultCell
                  v-else
                  :column="cell.column"
                  :item="item"
                  :show-tooltip="columnOverflowTooltip(cell.column)"
                />
              </div>
              <slot
                v-else-if="slots[`cell-${cell.column}`]"
                :name="`cell-${cell.column}`"
                v-bind="cellSlotProps(cell.column, item)"
              />
              <slot
                v-else-if="slots[`cell-${cell.column.toLowerCase()}`]"
                :name="`cell-${cell.column.toLowerCase()}`"
                v-bind="cellSlotProps(cell.column, item)"
              />
              <template v-else-if="cell.column === SYNTHETIC.expand">
                <button
                  type="button"
                  class="m-table__expand-btn"
                  :class="{ 'm-table__expand-btn--expanded': isRowExpanded(item, bodyRowIndex(index)) }"
                  :aria-expanded="isRowExpanded(item, bodyRowIndex(index))"
                  :aria-label="isRowExpanded(item, bodyRowIndex(index)) ? locale.collapse : locale.expand"
                  @click.stop="emit('toggle-expand', item, bodyRowIndex(index), $event)"
                >
                  <MIcon name="chevron-right" />
                </button>
              </template>
              <template v-else-if="cell.column === SYNTHETIC.checkbox">
                <MCheckbox
                  :model-value="isRowSelected(item, index)"
                  :indeterminate="isRowIndeterminate?.(item, index) ?? false"
                  :disabled="isRowCheckDisabled?.(item) ?? false"
                  :aria-label="locale.selectRow.replace('{index}', String(currentPageFirstIndex + bodyRowIndex(index)))"
                  @update:model-value="emit('toggle-select', item)"
                  @click.stop
                />
              </template>
              <template v-else-if="cell.column === SYNTHETIC.radio">
                <MRadio
                  :model-value="singleSelectedRowKey ?? undefined"
                  :value="getBodyRowKey(item, index)"
                  :disabled="isRowCheckDisabled?.(item) ?? false"
                  :aria-label="locale.selectRow.replace('{index}', String(currentPageFirstIndex + bodyRowIndex(index)))"
                  @update:model-value="emit('single-select', item)"
                  @click.stop
                />
              </template>
              <slot
                v-else-if="slots['body-cell']"
                name="body-cell"
                v-bind="{ column: cell.column, item, row: item, value: getItemValue(cell.column, item) }"
              />
              <template v-else-if="columnRenderMap.get(cell.column)">
                <span class="m-table__cell-text">{{ columnRenderMap.get(cell.column)!(item) }}</span>
              </template>
              <TableDefaultCell
                v-else
                :column="cell.column"
                :item="item"
                :show-tooltip="columnOverflowTooltip(cell.column)"
              />
            </div>
          </td>
        </template>
      </tr>
      <tr
        v-if="ifHasExpandSlot && isRowExpanded(item, bodyRowIndex(index))"
        :class="[
          { 'm-table__row--striped': striped && (bodyRowIndex(index) + 1) % 2 === 0 },
          typeof bodyExpandRowClassName === 'string' ? bodyExpandRowClassName : bodyExpandRowClassName(item, bodyRowIndex(index) + 1),
        ]"
      >
        <td
          :colspan="colCount"
          class="m-table__cell--expanded"
        >
          <TableLoadingLine v-if="(item as TableItem).expandLoading" />
          <slot
            name="expansion"
            v-bind="{ row: item }"
          />
        </td>
      </tr>
    </template>
    <tr
      v-if="virtualEnabled && offsetBottom > 0"
      class="m-table__virtual-spacer"
      aria-hidden="true"
    >
      <td
        :colspan="colCount"
        :style="{ height: `${offsetBottom}px`, padding: 0, border: 0 }"
      />
    </tr>
    <slot
      name="body-append"
      v-bind="{
        items: pageItems,
        pagination,
        headers: headersForRender,
      }"
    />
  </tbody>
</template>
