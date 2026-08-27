<script setup lang="ts">
import type {
  TreeCheckedKeys,
  TreeCheckStrategy,
  TreeExpandedKeys,
  TreeNode,
  TreeProps,
  TreeSelectionKeys,
} from './types'
import { computed, provide, reactive, ref, useSlots, watch } from 'vue'
import {
  buildChildMap,
  expandCheckedKeys,
  projectCheckedKeys,
  setCheckedCascade,
  syncAncestors,
  walkTree,
} from './checkStrategy'
import { WI_TREE_KEY, WI_TREE_NODE_SLOT } from './context'
import TreeNodeItem from './TreeNodeItem.vue'
const props = withDefaults(defineProps<TreeProps>(), {
  selectionMode: 'single',
  selectionKeys: () => ({}),
  modelValue: null,
  showCheckbox: false,
  checkedKeys: () => ({}),
  checkStrictly: false,
  checkStrategy: 'all' as TreeCheckStrategy,
  expandedKeys: undefined,
  defaultExpandAll: false,
  accordion: false,
  filter: '',
  lazy: false,
  draggable: false,
})

const emit = defineEmits<{
  (event: 'update:selectionKeys', value: TreeSelectionKeys): void
  (event: 'update:modelValue', value: string | null): void
  (event: 'update:checkedKeys', value: TreeCheckedKeys): void
  (event: 'update:expandedKeys', value: TreeExpandedKeys): void
  (event: 'node-expand', node: TreeNode): void
  (event: 'node-collapse', node: TreeNode): void
  (event: 'check', payload: { node: TreeNode; checkedKeys: TreeCheckedKeys }): void
  (event: 'node-drop', payload: { dragKey: string; dropKey: string; position: 'before' | 'after' | 'inside' }): void
}>()
const slots = useSlots()
provide(WI_TREE_NODE_SLOT, slots.default)

const innerExpanded = ref<TreeExpandedKeys>({})
const loadingKeys = reactive<Record<string, boolean>>({})
const dragKey = ref<string | null>(null)
const childMap = computed(() => buildChildMap(props.value))
const checkStrategy = computed(() => props.checkStrategy ?? 'all')

watch(
  () => [props.value, props.defaultExpandAll, props.expandedKeys] as const,
  () => {
    if (props.expandedKeys) {
      innerExpanded.value = { ...props.expandedKeys }
      return
    }
    if (props.defaultExpandAll) {
      const next: TreeExpandedKeys = {}
      walkTree(props.value, (node) => {
        if (node.children?.length) next[node.key] = true
      })
      innerExpanded.value = next
    }
  },
  { immediate: true, deep: true },
)

watch(
  () => props.expandedKeys,
  (value) => {
    if (value) innerExpanded.value = { ...value }
  },
)

const effectiveKeys = computed<TreeSelectionKeys>(() => {
  if (props.selectionMode === 'single' && props.modelValue) {
    return { [props.modelValue]: true }
  }
  return props.selectionKeys ?? {}
})

const checked = computed(() =>
  expandCheckedKeys(props.value, props.checkedKeys ?? {}, checkStrategy.value, props.checkStrictly),
)

function defaultFilter(value: string, data: TreeNode) {
  return data.label.toLowerCase().includes(value.toLowerCase())
}

function nodeMatches(node: TreeNode): boolean {
  const query = props.filter?.trim()
  if (!query) return true
  const matcher = props.filterNode ?? defaultFilter
  if (matcher(query, node)) return true
  return (node.children ?? []).some((child) => nodeMatches(child))
}

const visibleRoots = computed(() => {
  if (!props.filter?.trim()) return props.value
  return props.value.filter((node) => nodeMatches(node))
})

function isExpanded(key: string) {
  if (props.filter?.trim()) {
    const node = findNodeByKey(props.value, key)
    if (node && (node.children ?? []).some((child) => nodeMatches(child))) return true
  }
  return Boolean(innerExpanded.value[key])
}

function findNodeByKey(nodes: TreeNode[], key: string): TreeNode | null {
  for (const node of nodes) {
    if (node.key === key) return node
    const found = findNodeByKey(node.children ?? [], key)
    if (found) return found
  }
  return null
}

function isSelected(key: string) {
  return Boolean(effectiveKeys.value[key])
}

function isChecked(key: string) {
  return Boolean(checked.value[key])
}

function isIndeterminate(key: string) {
  if (props.checkStrictly || !props.showCheckbox) return false
  const children = childMap.value.get(key) ?? []
  if (!children.length) return false
  let checkedCount = 0
  let indeterminate = false
  for (const child of children) {
    if (isChecked(child.key)) checkedCount += 1
    if (isIndeterminate(child.key)) indeterminate = true
  }
  if (indeterminate) return true
  return checkedCount > 0 && checkedCount < children.length
}

function isDisabled(node: TreeNode) {
  return Boolean(node.disabled)
}

function isLeaf(node: TreeNode) {
  if (node.isLeaf) return true
  if (props.lazy) return !node.children?.length && !loadingKeys[node.key]
  return !node.children?.length
}

function isMatch(node: TreeNode) {
  const query = props.filter?.trim()
  if (!query) return false
  const matcher = props.filterNode ?? defaultFilter
  return matcher(query, node)
}

async function toggleExpand(node: TreeNode) {
  if (isDisabled(node)) return
  const open = isExpanded(node.key)
  let next: TreeExpandedKeys = { ...innerExpanded.value }
  if (open) {
    delete next[node.key]
    emit('node-collapse', node)
  } else {
    if (props.accordion) {
      next = {}
    }
    next[node.key] = true
    emit('node-expand', node)
    if (props.lazy && props.load && !node.children?.length && !node.isLeaf) {
      loadingKeys[node.key] = true
      try {
        const children = await props.load(node)
        node.children = children
      } finally {
        loadingKeys[node.key] = false
      }
    }
  }
  innerExpanded.value = next
  emit('update:expandedKeys', next)
}

function select(node: TreeNode) {
  if (isDisabled(node)) return
  if (props.selectionMode === 'single') {
    const next = isSelected(node.key) ? null : node.key
    emit('update:modelValue', next)
    emit('update:selectionKeys', next ? { [next]: true } : {})
    return
  }
  const next = { ...effectiveKeys.value }
  if (next[node.key]) delete next[node.key]
  else next[node.key] = true
  emit('update:selectionKeys', next)
}

function toggleCheck(node: TreeNode) {
  if (isDisabled(node)) return
  const next = { ...checked.value }
  const value = !isChecked(node.key)
  if (props.checkStrictly) {
    if (value) next[node.key] = true
    else delete next[node.key]
  } else {
    setCheckedCascade(node, value, next)
    syncAncestors(props.value, next)
  }
  const projected = projectCheckedKeys(props.value, next, checkStrategy.value, props.checkStrictly)
  emit('update:checkedKeys', projected)
  emit('check', { node, checkedKeys: projected })
}

function onDragStart(node: TreeNode, event: DragEvent) {
  if (!props.draggable || isDisabled(node)) {
    event.preventDefault()
    return
  }
  dragKey.value = node.key
  event.dataTransfer?.setData('text/plain', node.key)
  event.dataTransfer!.effectAllowed = 'move'
}

function onDragOver(node: TreeNode, event: DragEvent) {
  if (!props.draggable || !dragKey.value || dragKey.value === node.key) return
  event.preventDefault()
  event.dataTransfer!.dropEffect = 'move'
}

function onDrop(node: TreeNode, event: DragEvent) {
  if (!props.draggable || !dragKey.value || dragKey.value === node.key) return
  event.preventDefault()
  const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
  const offset = event.clientY - rect.top
  let position: 'before' | 'after' | 'inside' = 'inside'
  if (offset < rect.height * 0.25) position = 'before'
  else if (offset > rect.height * 0.75) position = 'after'
  emit('node-drop', { dragKey: dragKey.value, dropKey: node.key, position })
  dragKey.value = null
}

provide(WI_TREE_KEY, {
  isExpanded,
  isSelected,
  isChecked,
  isIndeterminate,
  isDisabled,
  isLeaf,
  isMatch,
  get showCheckbox() {
    return props.showCheckbox
  },
  get draggable() {
    return props.draggable
  },
  get lazy() {
    return props.lazy
  },
  loadingKeys,
  toggleExpand,
  select,
  toggleCheck,
  onDragStart,
  onDragOver,
  onDrop,
})
</script>

<template>
  <ul class="wi-tree" role="tree">
    <TreeNodeItem v-for="node in visibleRoots" :key="node.key" :node="node" />
  </ul>
</template>
