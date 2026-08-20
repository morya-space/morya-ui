<script setup lang="ts">
import { computed, inject } from 'vue'
import { useWiLocale } from '../../locale'
import WiCheckbox from '../Checkbox/Checkbox.vue'
import WiIcon from '../Icon/Icon.vue'
import { isIconName } from '../Icon/icons'
import type { IconName } from '../Icon/types'
import { WI_TREE_KEY, WI_TREE_NODE_SLOT } from './context'
import type { TreeNode } from './types'
import TreeNodeItem from './TreeNodeItem.vue'

const props = defineProps<{ node: TreeNode }>()
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
    class="wi-tree__node"
    role="treeitem"
    :aria-expanded="hasChildren ? expanded : undefined"
    :aria-disabled="disabled || undefined"
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
    >
      <button
        v-if="hasChildren"
        type="button"
        class="wi-tree__toggler"
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
        :disabled="disabled"
        @click="tree.select(node)"
      >
        <template v-if="customContent">
          <component :is="{ render: () => customContent }" />
        </template>
        <template v-else>{{ node.label }}</template>
      </button>
    </div>

    <ul v-if="hasChildren && expanded" class="wi-tree__children" role="group">
      <TreeNodeItem v-for="child in visibleChildren" :key="child.key" :node="child" />
    </ul>
  </li>
</template>
