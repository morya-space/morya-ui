<script setup lang="ts">
import type { IconName } from '../Icon/types'
import type { TreeNode } from './types'
import { computed, inject } from 'vue'
import { useRdLocale } from '../../locale'
import RdCheckbox from '../Checkbox/Checkbox.vue'
import RdIcon from '../Icon/Icon.vue'
import { isIconName } from '../Icon/icons'
import { RD_TREE_KEY, RD_TREE_NODE_SLOT } from './context'
import TreeNodeItem from './TreeNodeItem.vue'

const props = withDefaults(defineProps<{ node: TreeNode; depth?: number }>(), {
  depth: 1,
})
const tree = inject(RD_TREE_KEY)!
const nodeSlot = inject(RD_TREE_NODE_SLOT, undefined)
const locale = useRdLocale()

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
    class="rd-tree__node"
    :class="{ 'rd-tree__node--active': tree.activeKey.value === node.key }"
    role="treeitem"
    :aria-expanded="hasChildren ? expanded : undefined"
    :aria-disabled="disabled || undefined"
    :aria-level="depth"
    :aria-selected="selected"
    :aria-checked="tree.showCheckbox ? checked : undefined"
    :tabindex="tree.tabindexForKey(node.key)"
    :data-rd-tree-key="node.key"
    @focus="tree.setActiveKey(node.key)"
  >
    <div
      class="rd-tree__row"
      :class="{
        'rd-tree__row--selected': selected,
        'rd-tree__row--disabled': disabled,
        'rd-tree__row--matched': matched,
        'rd-tree__row--indeterminate': indeterminate,
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
        class="rd-tree__toggler"
        tabindex="-1"
        :aria-label="expanded ? locale.collapse : locale.expand"
        :disabled="disabled"
        @click="tree.toggleExpand(node)"
      >
        <RdIcon v-if="loading" name="loader" size="sm" />
        <RdIcon v-else :name="expanded ? 'chevron-down' : 'chevron-right'" size="sm" />
      </button>
      <span v-else class="rd-tree__toggler rd-tree__toggler--leaf" aria-hidden="true" />

      <RdCheckbox
        v-if="tree.showCheckbox"
        class="rd-tree__checkbox"
        tabindex="-1"
        :model-value="checked || indeterminate"
        :disabled="disabled"
        @update:model-value="tree.toggleCheck(node)"
        @click.stop
      />

      <span v-if="iconName || node.icon" class="rd-tree__icon" aria-hidden="true">
        <RdIcon v-if="iconName" :name="iconName" size="sm" />
        <template v-else>{{ node.icon }}</template>
      </span>

      <button
        type="button"
        class="rd-tree__label"
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

    <ul v-if="hasChildren && expanded" class="rd-tree__children" role="group">
      <TreeNodeItem v-for="child in visibleChildren" :key="child.key" :node="child" :depth="depth + 1" />
    </ul>
  </li>
</template>
