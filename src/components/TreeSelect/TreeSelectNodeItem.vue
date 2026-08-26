<script setup lang="ts">
import type { TreeSelectNode } from './types'
import { useWiLocale } from '../../locale'
import WiCheckbox from '../Checkbox/Checkbox.vue'
import TreeSelectNodeItem from './TreeSelectNodeItem.vue'

defineProps<{
  node: TreeSelectNode
  depth: number
  selectedKeys: string[]
  checkedKeys: Record<string, boolean>
  expanded: Record<string, boolean>
  showCheckbox: boolean
}>()

defineEmits<{
  (event: 'toggle', key: string): void
  (event: 'select', node: TreeSelectNode): void
  (event: 'check', node: TreeSelectNode): void
}>()

const locale = useWiLocale()
</script>

<template>
  <li
    class="wi-treeselect__node"
    role="treeitem"
    :aria-expanded="node.children?.length ? Boolean(expanded[node.key]) : undefined"
  >
    <div class="wi-treeselect__row" :style="{ paddingLeft: `${depth * 0.75}rem` }">
      <button
        v-if="node.children?.length"
        type="button"
        class="wi-treeselect__toggler"
        :aria-label="expanded[node.key] ? locale.collapse : locale.expand"
        @click.stop="$emit('toggle', node.key)"
      >
        {{ expanded[node.key] ? '▾' : '▸' }}
      </button>
      <span v-else class="wi-treeselect__toggler-spacer" />
      <WiCheckbox
        v-if="showCheckbox"
        class="wi-treeselect__checkbox"
        :model-value="Boolean(checkedKeys[node.key])"
        :disabled="node.disabled"
        @update:model-value="$emit('check', node)"
        @click.stop
      />
      <button
        type="button"
        class="wi-treeselect__option"
        :class="{ 'wi-treeselect__option--selected': selectedKeys.includes(node.key) }"
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
        :selected-keys="selectedKeys"
        :checked-keys="checkedKeys"
        :expanded="expanded"
        :show-checkbox="showCheckbox"
        @toggle="$emit('toggle', $event)"
        @select="$emit('select', $event)"
        @check="$emit('check', $event)"
      />
    </ul>
  </li>
</template>
