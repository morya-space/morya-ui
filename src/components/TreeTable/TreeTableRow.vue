<script setup lang="ts">
import type { TreeTableColumn, TreeTableNode } from './types'
import { useWdLocale } from '../../locale'
import TreeTableRow from './TreeTableRow.vue'

defineProps<{
  node: TreeTableNode
  columns: TreeTableColumn[]
  depth: number
  isExpanded: (key: string) => boolean
}>()

defineEmits<{
  (event: 'toggle', node: TreeTableNode): void
}>()

const locale = useWdLocale()
</script>

<template>
  <tr class="wd-treetable__row">
    <td
      v-for="(column, columnIndex) in columns"
      :key="column.field"
      class="wd-treetable__cell"
    >
      <div
        v-if="columnIndex === 0"
        class="wd-treetable__tree-cell"
        :style="{ paddingLeft: `${depth * 1}rem` }"
      >
        <button
          v-if="node.children?.length"
          type="button"
          class="wd-treetable__toggler"
          :aria-label="isExpanded(node.key) ? locale.collapse : locale.expand"
          @click="$emit('toggle', node)"
        >
          {{ isExpanded(node.key) ? '▾' : '▸' }}
        </button>
        <span v-else class="wd-treetable__toggler-spacer" />
        <span>{{ node.data[column.field] }}</span>
      </div>
      <template v-else>{{ node.data[column.field] }}</template>
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
      @toggle="$emit('toggle', $event)"
    />
  </template>
</template>
