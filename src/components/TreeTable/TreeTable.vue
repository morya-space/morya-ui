<script setup lang="ts">
import type { TreeTableEmits, TreeTableNode, TreeTableProps } from './types'
import { computed, ref } from 'vue'
import TreeTableRow from './TreeTableRow.vue'

const props = defineProps<TreeTableProps>()

const emit = defineEmits<TreeTableEmits>()

const internalExpanded = ref<Record<string, boolean>>({})
const expanded = computed(() => props.expandedKeys ?? internalExpanded.value)

function isExpanded(key: string) {
  return Boolean(expanded.value[key])
}

function toggle(node: TreeTableNode) {
  const next = { ...expanded.value, [node.key]: !expanded.value[node.key] }
  if (!next[node.key]) delete next[node.key]
  internalExpanded.value = next
  emit('update:expandedKeys', next)
  if (next[node.key]) emit('node-expand', node)
  else emit('node-collapse', node)
}
</script>

<template>
  <div class="wi-treetable">
    <table class="wi-treetable__table" role="treegrid">
      <thead>
        <tr>
          <th v-for="column in columns" :key="column.field" scope="col">
            {{ column.header }}
          </th>
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
