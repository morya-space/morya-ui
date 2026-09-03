<script setup lang="ts">
import type { TreeTableEmits, TreeTableNode, TreeTableProps } from './types'
import { computed, ref, useSlots } from 'vue'
import { useWiLocale } from '../../locale'
import TreeTableRow from './TreeTableRow.vue'

const props = defineProps<TreeTableProps>()

const emit = defineEmits<TreeTableEmits>()
const slots = useSlots()

const locale = useWiLocale()
const internalExpanded = ref<Record<string, boolean>>({})
const expanded = computed(() => props.expandedKeys ?? internalExpanded.value)

const resolvedEmptyMessage = computed(
  () => props.emptyMessage ?? locale.value.emptyMessage,
)
const renderExpansion = computed(() =>
  slots.expansion ? (row: TreeTableNode) => slots.expansion?.({ row }) : undefined,
)

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
      <tbody v-if="value.length">
        <TreeTableRow
          v-for="node in value"
          :key="node.key"
          :node="node"
          :columns="columns"
          :depth="0"
          :is-expanded="isExpanded"
          :render-expansion="renderExpansion"
          @toggle="toggle"
        />
      </tbody>
    </table>
    <div v-if="!value.length" class="wi-treetable__message" role="status">
      <slot name="empty">
        <p class="wi-treetable__empty-text">{{ resolvedEmptyMessage }}</p>
      </slot>
    </div>
  </div>
</template>
