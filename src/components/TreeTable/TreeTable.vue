<script setup lang="ts">
import { ref } from 'vue'
import type { TreeTableNode, TreeTableProps } from './types'
import TreeTableRow from './TreeTableRow.vue'

defineProps<TreeTableProps>()

const emit = defineEmits<{
  (event: 'node-expand', node: TreeTableNode): void
  (event: 'node-collapse', node: TreeTableNode): void
}>()

const expanded = ref<Record<string, boolean>>({})

function isExpanded(key: string) {
  return Boolean(expanded.value[key])
}

function toggle(node: TreeTableNode) {
  const next = !expanded.value[node.key]
  expanded.value = { ...expanded.value, [node.key]: next }
  if (next) emit('node-expand', node)
  else emit('node-collapse', node)
}
</script>

<template>
  <div class="wi-treetable">
    <table class="wi-treetable__table">
      <thead>
        <tr>
          <th v-for="column in columns" :key="column.field" scope="col">{{ column.header }}</th>
        </tr>
      </thead>
      <tbody>
        <TreeTableRow
          v-for="node in value"
          :key="node.key"
          :node="node"
          :columns="columns"
          :depth="0"
          :is-expanded="isExpanded"
          @toggle="toggle"
        />
      </tbody>
    </table>
  </div>
</template>
