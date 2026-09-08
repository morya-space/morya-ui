<script setup lang="ts">
import type { TreeTableColumn, TreeTableNode } from './types'
import type { VNode } from 'vue'
import { useWkLocale } from '../../locale'
import WkIcon from '../Icon/Icon.vue'
import TreeTableRow from './TreeTableRow.vue'

defineProps<{
  node: TreeTableNode
  columns: TreeTableColumn[]
  depth: number
  isExpanded: (key: string) => boolean
  renderExpansion?: (row: TreeTableNode) => VNode | VNode[] | string | undefined
}>()

defineEmits<{
  (event: 'toggle', node: TreeTableNode): void
}>()

const locale = useWkLocale()
</script>

<template>
  <tr
    class="wk-treetable__row"
    :aria-expanded="node.children?.length ? isExpanded(node.key) : undefined"
    :aria-level="depth + 1"
  >
    <td
      v-for="(column, columnIndex) in columns"
      :key="column.field"
      class="wk-treetable__cell"
    >
      <div
        v-if="columnIndex === 0"
        class="wk-treetable__tree-cell"
        :style="{ paddingLeft: `${depth * 1}rem` }"
      >
        <button
          v-if="node.children?.length"
          type="button"
          class="wk-treetable__toggler"
          :aria-label="isExpanded(node.key) ? locale.collapse : locale.expand"
          @click="$emit('toggle', node)"
        >
          <WkIcon
            :name="isExpanded(node.key) ? 'chevron-down' : 'chevron-right'"
            size="sm"
          />
        </button>
        <span v-else class="wk-treetable__toggler-spacer" />
        <span>{{ node.data[column.field] }}</span>
      </div>
      <template v-else>
        {{ node.data[column.field] }}
      </template>
    </td>
  </tr>
  <tr v-if="renderExpansion && isExpanded(node.key)" class="wk-treetable__expansion-row">
    <td :colspan="columns.length" class="wk-treetable__expansion-cell">
      <component :is="() => renderExpansion!(node)" />
    </td>
  </tr>
  <template v-if="node.children?.length && isExpanded(node.key)">
    <TreeTableRow
      v-for="child in node.children"
      :key="child.key"
      :node="child"
      :columns="columns"
      :depth="depth + 1"
      :is-expanded="isExpanded"
      :render-expansion="renderExpansion"
      @toggle="$emit('toggle', $event)"
    />
  </template>
</template>
