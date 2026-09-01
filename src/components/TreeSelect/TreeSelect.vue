<script setup lang="ts">
import type { TreeCheckedKeys } from '../Tree/types'
import type { TreeSelectNode, TreeSelectProps, TreeSelectValue } from './types'
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { useWiLocale } from '../../locale'
import { useConfiguredSize, useWiConfig } from '../../shared/config'
import { isOverlayTeleported, resolveOverlayTeleport } from '../../shared/overlay'
import { computeFloatingOverlayStyle } from '../../shared/overlayPlacement'
import {
  expandCheckedKeys,
  findNode,
  nodePathLabels,
  projectCheckedKeys,
  setCheckedCascade,
  syncAncestors,
} from '../Tree/checkStrategy'
import TreeSelectNodeItem from './TreeSelectNodeItem.vue'
import WiIcon from '../Icon/Icon.vue'

const props = withDefaults(defineProps<TreeSelectProps>(), {
  modelValue: null,
  placeholder: undefined,
  disabled: false,
  selectionMode: 'single',
  multiple: false,
  checkable: false,
  checkStrictly: false,
  checkStrategy: 'all',
  clearable: false,
  filterable: false,
  showPath: false,
  separator: ' / ',
  teleport: true,
})

const emit = defineEmits<{
  (event: 'update:modelValue', value: TreeSelectValue): void
  (event: 'clear'): void
}>()

const config = useWiConfig()
const locale = useWiLocale()
const sizeClass = useConfiguredSize('TreeSelect', () => props.size)
const open = ref(false)
const query = ref('')
const root = ref<HTMLElement | null>(null)
const trigger = ref<HTMLElement | null>(null)
const panel = ref<HTMLElement | null>(null)
const panelStyle = ref<Record<string, string>>({})
const expanded = ref<Record<string, boolean>>({})
const teleportTarget = computed(() => resolveOverlayTeleport(props, config.value.appendTo))
const teleported = computed(() => isOverlayTeleported(props, config.value.appendTo))
const isMultiple = computed(() => props.multiple || props.selectionMode === 'multiple' || props.checkable)
const selectedKeys = computed(() => {
  if (Array.isArray(props.modelValue)) return props.modelValue
  return typeof props.modelValue === 'string' && props.modelValue ? [props.modelValue] : []
})
const incomingChecked = computed<TreeCheckedKeys>(() => {
  const keys: TreeCheckedKeys = {}
  for (const key of selectedKeys.value) keys[key] = true
  return keys
})
const checkedKeys = computed(() =>
  expandCheckedKeys(props.options, incomingChecked.value, props.checkStrategy, props.checkStrictly),
)
const displayLabel = computed(() => {
  const key = selectedKeys.value[0]
  if (!key || isMultiple.value) return props.placeholder ?? locale.value.selectPlaceholder
  if (props.showPath) {
    const path = nodePathLabels(props.options, key)
    return path.length ? path.join(props.separator) : key
  }
  return findNode(props.options, key)?.label ?? props.placeholder ?? locale.value.selectPlaceholder
})
const selectedTags = computed(() =>
  selectedKeys.value.map((key) => ({
    key,
    label: props.showPath ? nodePathLabels(props.options, key).join(props.separator) : (findNode(props.options, key)?.label ?? key),
  })),
)
const visibleTags = computed(() => {
  const max = props.maxTagCount
  if (max == null || max < 0 || selectedTags.value.length <= max) return selectedTags.value
  return selectedTags.value.slice(0, max)
})
const hiddenTagCount = computed(() => Math.max(0, selectedTags.value.length - visibleTags.value.length))
const filteredOptions = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return props.options
  const match = (node: TreeSelectNode): TreeSelectNode | null => {
    const self = node.label.toLowerCase().includes(q)
    const children = (node.children ?? []).map(match).filter((item): item is TreeSelectNode => item != null)
    if (self || children.length) return { ...node, children: children.length ? children : node.children }
    return null
  }
  return props.options.map(match).filter((item): item is TreeSelectNode => item != null)
})

function updatePanelPosition() {
  if (!teleported.value || !trigger.value) return
  const rect = trigger.value.getBoundingClientRect()
  panelStyle.value = computeFloatingOverlayStyle(rect, 'bottom-start', {
    minWidth: `${rect.width}px`,
  })
}

function toggle() {
  if (props.disabled) return
  open.value = !open.value
  if (open.value) void nextTick(() => updatePanelPosition())
}

function toggleExpand(key: string) {
  expanded.value = { ...expanded.value, [key]: !expanded.value[key] }
}

function emitKeys(keys: string[]) {
  if (isMultiple.value) emit('update:modelValue', keys)
  else emit('update:modelValue', keys[0] ?? null)
}

function select(node: TreeSelectNode) {
  if (node.disabled) return
  if (props.checkable) {
    toggleCheck(node)
    return
  }
  if (!isMultiple.value) {
    emit('update:modelValue', node.key === props.modelValue ? null : node.key)
    open.value = false
    return
  }
  const next = selectedKeys.value.includes(node.key)
    ? selectedKeys.value.filter((key) => key !== node.key)
    : [...selectedKeys.value, node.key]
  emitKeys(next)
}

function toggleCheck(node: TreeSelectNode) {
  if (node.disabled) return
  const next = { ...checkedKeys.value }
  const value = !next[node.key]
  if (props.checkStrictly) {
    if (value) next[node.key] = true
    else delete next[node.key]
  } else {
    setCheckedCascade(node, value, next)
    syncAncestors(props.options, next)
  }
  const projected = projectCheckedKeys(props.options, next, props.checkStrategy, props.checkStrictly)
  emitKeys(Object.keys(projected).filter((key) => projected[key]))
}

function removeTag(key: string) {
  emitKeys(selectedKeys.value.filter((item) => item !== key))
}

function clear(event: MouseEvent) {
  event.stopPropagation()
  emit('update:modelValue', isMultiple.value ? [] : null)
  emit('clear')
}

function onDocumentClick(event: MouseEvent) {
  const target = event.target as Node
  if (root.value?.contains(target) || panel.value?.contains(target)) return
  open.value = false
}

function onViewportChange() {
  if (open.value) updatePanelPosition()
}

watch(open, (isOpen) => {
  if (isOpen) {
    document.addEventListener('click', onDocumentClick)
    if (teleported.value) {
      window.addEventListener('resize', onViewportChange)
      window.addEventListener('scroll', onViewportChange, true)
    }
  } else {
    query.value = ''
    document.removeEventListener('click', onDocumentClick)
    window.removeEventListener('resize', onViewportChange)
    window.removeEventListener('scroll', onViewportChange, true)
  }
})

onBeforeUnmount(() => {
  document.removeEventListener('click', onDocumentClick)
  window.removeEventListener('resize', onViewportChange)
  window.removeEventListener('scroll', onViewportChange, true)
})
</script>

<template>
  <div
    ref="root"
    class="wi-treeselect"
    :class="[
      `wi-treeselect--${sizeClass}`,
      {
        'wi-treeselect--disabled': disabled,
        'wi-treeselect--open': open,
        'wi-treeselect--multiple': isMultiple,
      },
    ]"
  >
    <div
      ref="trigger"
      class="wi-treeselect__trigger"
      role="combobox"
      tabindex="0"
      :aria-disabled="disabled || undefined"
      :aria-expanded="open"
      aria-haspopup="tree"
      @click="toggle"
      @keydown.enter.prevent="toggle"
    >
      <div v-if="isMultiple && selectedTags.length" class="wi-treeselect__tags">
        <span v-for="tag in visibleTags" :key="tag.key" class="wi-select__tag">
          <span class="wi-select__tag-label">{{ tag.label }}</span>
          <button
            type="button"
            class="wi-select__tag-remove"
            :aria-label="locale.remove"
            :disabled="disabled"
            @click.stop="removeTag(tag.key)"
          >
            <WiIcon name="close" size="sm" />
          </button>
        </span>
        <span v-if="hiddenTagCount" class="wi-select__tag wi-select__tag--more">
          {{ hiddenTagCount > 0 ? `+${hiddenTagCount}` : '' }}
        </span>
      </div>
      <span v-else class="wi-treeselect__label" :class="{ 'wi-treeselect__label--placeholder': !selectedKeys.length }">
        {{ displayLabel }}
      </span>
      <button
        v-if="clearable && selectedKeys.length && !disabled"
        type="button"
        class="wi-treeselect__clear"
        :aria-label="locale.clear"
        @click="clear"
      >
        <WiIcon name="close" size="sm" />
      </button>
      <span class="wi-treeselect__caret" aria-hidden="true">
        <WiIcon name="chevron-down" size="sm" />
      </span>
    </div>
    <Teleport :to="teleportTarget.to" :disabled="teleportTarget.disabled">
      <Transition name="wi-scale-fade">
        <div
          v-if="open"
          ref="panel"
          class="wi-treeselect__panel"
          :class="{ 'wi-treeselect__panel--teleported': teleported }"
          :style="teleported ? panelStyle : undefined"
        >
          <input
            v-if="filterable"
            v-model="query"
            class="wi-treeselect__filter"
            type="search"
            :placeholder="locale.searchPlaceholder"
            @click.stop
          >
          <ul class="wi-treeselect__tree" role="tree">
            <TreeSelectNodeItem
              v-for="node in filteredOptions"
              :key="node.key"
              :node="node"
              :depth="0"
              :selected-keys="selectedKeys"
              :checked-keys="checkedKeys"
              :expanded="expanded"
              :show-checkbox="checkable"
              @toggle="toggleExpand"
              @select="select"
              @check="toggleCheck"
            />
          </ul>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>
