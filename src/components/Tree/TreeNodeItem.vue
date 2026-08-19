<script setup lang="ts">
import { computed, inject } from 'vue'
import { useWdLocale } from '../../locale'
import WdCheckbox from '../Checkbox/Checkbox.vue'
import WdIcon from '../Icon/Icon.vue'
import { isIconName } from '../Icon/icons'
import type { IconName } from '../Icon/types'
import { WD_TREE_KEY, WD_TREE_NODE_SLOT } from './context'
import type { TreeNode } from './types'
import TreeNodeItem from './TreeNodeItem.vue'

const props = defineProps<{ node: TreeNode }>()
const tree = inject(WD_TREE_KEY)!
const nodeSlot = inject(WD_TREE_NODE_SLOT, undefined)
const locale = useWdLocale()

const expanded = computed(() => tree.isExpanded(props.node.key))
const selected = computed(() => tree.isSelected(props.node.key))
const checked = computed(() => tree.isChecked(props.node.key))
const indeterminate = computed(() => tree.isIndeterminate(props.node.key))
const disabled = computed(() => tree.isDisabled(props.node))
const matched = computed(() => tree.isMatch(props.node))
const loading = computed(() => Boolean(tree.loadingKeys[props.node.key]))
const hasChildren = computed(
  () => Boolean(props.node.children?.length) || (tree.lazy && !props.node.isLeaf),
)

const iconName = computed<IconName | undefined>(() => {
  if (props.node.icon && isIconName(props.node.icon)) return props.node.icon
  return undefined
})

const visibleChildren = computed(() => props.node.children ?? [])

const customContent = computed(() =>
  nodeSlot?.({ node: props.node, data: props.node }),
)
</script>

<template>
  <li
    class="wd-tree__node"
    role="treeitem"
    :aria-expanded="hasChildren ? expanded : undefined"
    :aria-disabled="disabled || undefined"
  >
    <div
      class="wd-tree__row"
      :class="{
        'wd-tree__row--selected': selected,
        'wd-tree__row--disabled': disabled,
        'wd-tree__row--matched': matched,
        'wd-tree__row--indeterminate': indeterminate,
      }"
      :draggable="tree.draggable && !disabled"
      @dragstart="tree.onDragStart(node, $event)"
      @dragover="tree.onDragOver(node, $event)"
      @drop="tree.onDrop(node, $event)"
    >
      <button
        v-if="hasChildren"
        type="button"
        class="wd-tree__toggler"
        :aria-label="expanded ? locale.collapse : locale.expand"
        :disabled="disabled"
        @click="tree.toggleExpand(node)"
      >
        <WdIcon v-if="loading" name="loader" size="sm" />
        <WdIcon v-else :name="expanded ? 'chevron-down' : 'chevron-right'" size="sm" />
      </button>
      <span v-else class="wd-tree__toggler wd-tree__toggler--leaf" aria-hidden="true" />

      <WdCheckbox
        v-if="tree.showCheckbox"
        class="wd-tree__checkbox"
        :model-value="checked || indeterminate"
        :disabled="disabled"
        @update:model-value="tree.toggleCheck(node)"
        @click.stop
      />

      <span v-if="iconName || node.icon" class="wd-tree__icon" aria-hidden="true">
        <WdIcon v-if="iconName" :name="iconName" size="sm" />
        <template v-else>{{ node.icon }}</template>
      </span>

      <button
        type="button"
        class="wd-tree__label"
        :disabled="disabled"
        @click="tree.select(node)"
      >
        <template v-if="customContent">
          <component :is="{ render: () => customContent }" />
        </template>
        <template v-else>{{ node.label }}</template>
      </button>
    </div>

    <ul v-if="hasChildren && expanded" class="wd-tree__children" role="group">
      <TreeNodeItem v-for="child in visibleChildren" :key="child.key" :node="child" />
    </ul>
  </li>
</template>
