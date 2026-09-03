<script setup lang="ts">
import type { IconName } from '../Icon/types'
import type { TreeNode } from './types'
import { computed, inject } from 'vue'
import { useWiLocale } from '../../locale'
import WiCheckbox from '../Checkbox/Checkbox.vue'
import WiIcon from '../Icon/Icon.vue'
import { isIconName } from '../Icon/icons'
import { WI_TREE_KEY, WI_TREE_NODE_SLOT } from './context'
import TreeNodeItem from './TreeNodeItem.vue'

const props = withDefaults(defineProps<{ node: TreeNode; depth?: number }>(), {
  depth: 1,
})
const tree = inject(WI_TREE_KEY)!
const nodeSlot = inject(WI_TREE_NODE_SLOT, undefined)
const locale = useWiLocale()

const expanded = computed(() => tree.isExpanded(props.node.key))
const selected = computed(() => tree.isSelected(props.node.key))
const checked = computed(() => tree.isChecked(props.node.key))
const indeterminate = computed(() => tree.isIndeterminate(props.node.key))
const disabled = computed(() => tree.isDisabled(props.node))
const matched = computed(() => tree.isMatch(props.node))
const loading = computed(() => Boolean(tree.loadingKeys[props.node.key]))
const hasChildren = computed(() => tree.hasChildren(props.node))

const iconName = computed<IconName | undefined>(() => {
  if (props.node.icon && isIconName(props.node.icon)) return props.node.icon
  return undefined
})

const visibleChildren = computed(() => props.node.children ?? tree.loadedChildren[props.node.key] ?? [])

const customContent = computed(() =>
  nodeSlot?.({ node: props.node, data: props.node }),
)
</script>

<template>
  <li
    class="wi-tree__node"
    :class="{ 'wi-tree__node--active': tree.activeKey.value === node.key }"
    role="treeitem"
    :aria-expanded="hasChildren ? expanded : undefined"
    :aria-disabled="disabled || undefined"
    :aria-level="depth"
    :aria-selected="selected"
    :aria-checked="tree.showCheckbox ? checked : undefined"
    :tabindex="tree.tabindexForKey(node.key)"
    :data-wi-tree-key="node.key"
    @focus="tree.setActiveKey(node.key)"
  >
    <div
      class="wi-tree__row"
      :class="{
        'wi-tree__row--selected': selected,
        'wi-tree__row--disabled': disabled,
        'wi-tree__row--matched': matched,
        'wi-tree__row--indeterminate': indeterminate,
      }"
      :draggable="tree.draggable && !disabled"
      @dragstart="tree.onDragStart(node, $event)"
      @dragover="tree.onDragOver(node, $event)"
      @drop="tree.onDrop(node, $event)"
      @dragend="tree.onDragEnd()"
    >
      <button
        v-if="hasChildren"
        type="button"
        class="wi-tree__toggler"
        tabindex="-1"
        :aria-label="expanded ? locale.collapse : locale.expand"
        :disabled="disabled"
        @click="tree.toggleExpand(node)"
      >
        <WiIcon v-if="loading" name="loader" size="sm" />
        <WiIcon v-else :name="expanded ? 'chevron-down' : 'chevron-right'" size="sm" />
      </button>
      <span v-else class="wi-tree__toggler wi-tree__toggler--leaf" aria-hidden="true" />

      <WiCheckbox
        v-if="tree.showCheckbox"
        class="wi-tree__checkbox"
        tabindex="-1"
        :model-value="checked || indeterminate"
        :disabled="disabled"
        @update:model-value="tree.toggleCheck(node)"
        @click.stop
      />

      <span v-if="iconName || node.icon" class="wi-tree__icon" aria-hidden="true">
        <WiIcon v-if="iconName" :name="iconName" size="sm" />
        <template v-else>{{ node.icon }}</template>
      </span>

      <button
        type="button"
        class="wi-tree__label"
        tabindex="-1"
        :disabled="disabled"
        @click="tree.select(node)"
      >
        <template v-if="customContent">
          <component :is="{ render: () => customContent }" />
        </template>
        <template v-else>
          {{ node.label }}
        </template>
      </button>
    </div>

    <ul v-if="hasChildren && expanded" class="wi-tree__children" role="group">
      <TreeNodeItem v-for="child in visibleChildren" :key="child.key" :node="child" :depth="depth + 1" />
    </ul>
  </li>
</template>
