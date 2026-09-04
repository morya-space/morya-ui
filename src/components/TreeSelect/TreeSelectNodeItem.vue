<script setup lang="ts">
import type { TreeSelectNode } from './types'
import type { VNode } from 'vue'
import { useWdLocale } from '../../locale'
import WdCheckbox from '../Checkbox/Checkbox.vue'
import WdIcon from '../Icon/Icon.vue'
import TreeSelectNodeItem from './TreeSelectNodeItem.vue'

defineProps<{
  node: TreeSelectNode
  depth: number
  selectedKeys: string[]
  checkedKeys: Record<string, boolean>
  expanded: Record<string, boolean>
  showCheckbox: boolean
  activeKey: string | null
  renderOption?: (node: TreeSelectNode) => VNode | VNode[] | string | undefined
}>()

defineEmits<{
  (event: 'toggle', key: string): void
  (event: 'select', node: TreeSelectNode): void
  (event: 'check', node: TreeSelectNode): void
}>()

const locale = useWdLocale()
</script>

<template>
  <li
    class="wd-treeselect__node"
    :class="{ 'wd-treeselect__node--active': node.key === activeKey }"
    role="treeitem"
    :aria-expanded="node.children?.length ? Boolean(expanded[node.key]) : undefined"
    :aria-level="depth + 1"
    :aria-disabled="node.disabled || undefined"
    :aria-selected="showCheckbox ? undefined : selectedKeys.includes(node.key)"
    :aria-checked="showCheckbox ? Boolean(checkedKeys[node.key]) : undefined"
  >
    <div class="wd-treeselect__row" :style="{ paddingLeft: `${depth * 0.75}rem` }">
      <button
        v-if="node.children?.length"
        type="button"
        class="wd-treeselect__toggler"
        tabindex="-1"
        :aria-label="expanded[node.key] ? locale.collapse : locale.expand"
        @click.stop="$emit('toggle', node.key)"
      >
        <WdIcon :name="expanded[node.key] ? 'chevron-down' : 'chevron-right'" size="sm" />
      </button>
      <span v-else class="wd-treeselect__toggler-spacer" />
      <WdCheckbox
        v-if="showCheckbox"
        class="wd-treeselect__checkbox"
        tabindex="-1"
        :model-value="Boolean(checkedKeys[node.key])"
        :disabled="node.disabled"
        @update:model-value="$emit('check', node)"
        @click.stop
      />
      <button
        type="button"
        class="wd-treeselect__option"
        :class="{ 'wd-treeselect__option--selected': selectedKeys.includes(node.key) }"
        :disabled="node.disabled"
        :tabindex="node.key === activeKey ? 0 : -1"
        @click="$emit('select', node)"
      >
        <component :is="() => renderOption?.(node)" v-if="renderOption" />
        <template v-else>{{ node.label }}</template>
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
        :active-key="activeKey"
        :render-option="renderOption"
        @toggle="$emit('toggle', $event)"
        @select="$emit('select', $event)"
        @check="$emit('check', $event)"
      >
      </TreeSelectNodeItem>
    </ul>
  </li>
</template>
