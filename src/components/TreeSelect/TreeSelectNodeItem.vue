<script setup lang="ts">
import type { TreeSelectNode } from './types'
import { useWdLocale } from '../../locale'
import TreeSelectNodeItem from './TreeSelectNodeItem.vue'

defineProps<{
  node: TreeSelectNode
  depth: number
  selectedKey: string | null
  expanded: Record<string, boolean>
}>()

defineEmits<{
  (event: 'toggle', key: string): void
  (event: 'select', node: TreeSelectNode): void
}>()

const locale = useWdLocale()
</script>

<template>
  <li
    class="wd-treeselect__node"
    role="treeitem"
    :aria-expanded="node.children?.length ? Boolean(expanded[node.key]) : undefined"
  >
    <div class="wd-treeselect__row" :style="{ paddingLeft: `${depth * 0.75}rem` }">
      <button
        v-if="node.children?.length"
        type="button"
        class="wd-treeselect__toggler"
        :aria-label="expanded[node.key] ? locale.collapse : locale.expand"
        @click.stop="$emit('toggle', node.key)"
      >
        {{ expanded[node.key] ? '▾' : '▸' }}
      </button>
      <span v-else class="wd-treeselect__toggler-spacer" />
      <button
        type="button"
        class="wd-treeselect__option"
        :class="{ 'wd-treeselect__option--selected': selectedKey === node.key }"
        :disabled="node.disabled"
        @click="$emit('select', node)"
      >
        {{ node.label }}
      </button>
    </div>
    <ul v-if="node.children?.length && expanded[node.key]" role="group">
      <TreeSelectNodeItem
        v-for="child in node.children"
        :key="child.key"
        :node="child"
        :depth="depth + 1"
        :selected-key="selectedKey"
        :expanded="expanded"
        @toggle="$emit('toggle', $event)"
        @select="$emit('select', $event)"
      />
    </ul>
  </li>
</template>
