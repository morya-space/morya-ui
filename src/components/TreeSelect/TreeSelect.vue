<script setup lang="ts">
import type { TreeCheckedKeys } from '../Tree/types'
import type { TreeSelectNode, TreeSelectProps, TreeSelectValue } from './types'
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { useWiLocale } from '../../locale'
import { useConfiguredSize, useWiConfig } from '../../shared/config'
import { isOverlayTeleported, resolveOverlayTeleport } from '../../shared/overlay'
import { computeFloatingOverlayStyle } from '../../shared/overlayPlacement'
import { useMenuKeyboard } from '../../shared/useMenuKeyboard'
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
const showClearButton = computed(() => props.clearable && selectedKeys.value.length > 0 && !props.disabled)
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

interface FlatTreeNode {
  node: TreeSelectNode
  parentKey: string | null
}

const flatNodes = computed<FlatTreeNode[]>(() => {
  const list: FlatTreeNode[] = []
  const walk = (nodes: TreeSelectNode[], parentKey: string | null) => {
    for (const node of nodes) {
      list.push({ node, parentKey })
      if (node.children?.length && expanded.value[node.key]) walk(node.children, node.key)
    }
  }
  walk(filteredOptions.value, null)
  return list
})

const panelId = `wi-treeselect-panel-${Math.random().toString(36).slice(2, 8)}`

const keyboard = useMenuKeyboard({
  itemCount: () => flatNodes.value.length,
  isItemDisabled: (index) => Boolean(flatNodes.value[index]?.node.disabled),
  enabled: open,
  onActivate: (index) => {
    const flat = flatNodes.value[index]
    if (flat) select(flat.node)
  },
  onEscape: () => {
    open.value = false
  },
  returnFocusTo: trigger,
})

const activeKey = computed(() => flatNodes.value[keyboard.activeIndex.value]?.node.key ?? null)

function focusActiveNode() {
  const index = keyboard.activeIndex.value
  if (index < 0) return
  const options = panel.value?.querySelectorAll<HTMLElement>('.wi-treeselect__option')
  const option = options?.[index]
  if (option && document.activeElement !== option) option.focus({ preventScroll: true })
  option?.scrollIntoView({ block: 'nearest' })
}

function updatePanelPosition() {
  if (!teleported.value || !trigger.value) return
  const rect = trigger.value.getBoundingClientRect()
  panelStyle.value = computeFloatingOverlayStyle(rect, 'bottom-start', {
    minWidth: `${rect.width}px`,
  })
}

function openPanel() {
  open.value = true
  void nextTick(() => {
    updatePanelPosition()
    const selectedIndex = flatNodes.value.findIndex((flat) => selectedKeys.value.includes(flat.node.key))
    if (selectedIndex >= 0) keyboard.setActive(selectedIndex)
    else keyboard.moveFirst()
    if (props.filterable) panel.value?.querySelector<HTMLElement>('.wi-treeselect__filter')?.focus()
    else focusActiveNode()
  })
}

function toggle() {
  if (props.disabled) return
  if (open.value) {
    open.value = false
    return
  }
  openPanel()
}

function onTreeKeydown(event: KeyboardEvent) {
  if (!open.value) return
  const flat = flatNodes.value
  const current = flat[keyboard.activeIndex.value]
  if (event.key === 'ArrowRight') {
    event.preventDefault()
    if (!current) return
    if (current.node.children?.length) {
      if (!expanded.value[current.node.key]) {
        toggleExpand(current.node.key)
      } else {
        const childIndex = flat.findIndex((item) => item.parentKey === current.node.key)
        if (childIndex >= 0) keyboard.setActive(childIndex)
      }
    }
    return
  }
  if (event.key === 'ArrowLeft') {
    event.preventDefault()
    if (!current) return
    if (current.node.children?.length && expanded.value[current.node.key]) {
      toggleExpand(current.node.key)
    } else if (current.parentKey != null) {
      const parentIndex = flat.findIndex((item) => item.node.key === current.parentKey)
      if (parentIndex >= 0) keyboard.setActive(parentIndex)
    }
    return
  }
  keyboard.onKeydown(event)
}

function onTriggerKeydown(event: KeyboardEvent) {
  if (props.disabled) return
  if (!open.value) {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      openPanel()
    } else if (event.key === 'Enter') {
      event.preventDefault()
      toggle()
    }
    return
  }
  onTreeKeydown(event)
}

function onFilterKeydown(event: KeyboardEvent) {
  if (['ArrowUp', 'ArrowDown', 'Enter', 'Escape'].includes(event.key)) onTreeKeydown(event)
}

watch(keyboard.activeIndex, () => {
  if (open.value && !props.filterable) focusActiveNode()
  else if (open.value) {
    const index = keyboard.activeIndex.value
    panel.value
      ?.querySelectorAll<HTMLElement>('.wi-treeselect__option')
      [index]?.scrollIntoView({ block: 'nearest' })
  }
})

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
    trigger.value?.focus({ preventScroll: true })
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

function onDocumentFocusIn(event: FocusEvent) {
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
    document.addEventListener('focusin', onDocumentFocusIn)
    if (teleported.value) {
      window.addEventListener('resize', onViewportChange)
      window.addEventListener('scroll', onViewportChange, true)
    }
  } else {
    query.value = ''
    keyboard.reset()
    document.removeEventListener('click', onDocumentClick)
    document.removeEventListener('focusin', onDocumentFocusIn)
    window.removeEventListener('resize', onViewportChange)
    window.removeEventListener('scroll', onViewportChange, true)
  }
})

onBeforeUnmount(() => {
  document.removeEventListener('click', onDocumentClick)
  document.removeEventListener('focusin', onDocumentFocusIn)
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
      class="wi-treeselect__control wi-select__control"
      :class="{
        'wi-select__control--clearable': showClearButton,
        'wi-select__control--open': open,
      }"
    >
      <div
        ref="trigger"
        class="wi-treeselect__trigger"
        role="combobox"
        :tabindex="disabled ? -1 : 0"
        :aria-disabled="disabled || undefined"
        :aria-expanded="open"
        :aria-controls="open ? panelId : undefined"
        aria-haspopup="tree"
        @click="toggle"
        @keydown="onTriggerKeydown"
      >
        <div v-if="isMultiple && selectedTags.length" class="wi-treeselect__tags">
          <span v-for="tag in visibleTags" :key="tag.key" class="wi-select__tag">
            <span class="wi-select__tag-label">{{ tag.label }}</span>
            <button
              type="button"
              class="wi-select__tag-remove"
              :aria-label="locale.removeTag"
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
      </div>
      <div class="wi-select__suffix">
        <button
          v-if="showClearButton"
          class="wi-select__clear"
          type="button"
          :aria-label="locale.clear"
          @click="clear"
        >
          <WiIcon name="close" size="sm" />
        </button>
        <span
          class="wi-select__indicator"
          :class="{ 'wi-select__indicator--open': open }"
          aria-hidden="true"
        >
          <WiIcon name="chevron-down" size="sm" />
        </span>
      </div>
    </div>
    <Teleport :to="teleportTarget.to" :disabled="teleportTarget.disabled">
      <Transition name="wi-scale-fade">
        <div
          v-if="open"
          :id="panelId"
          ref="panel"
          class="wi-treeselect__panel"
          :class="{ 'wi-treeselect__panel--teleported': teleported }"
          :style="teleported ? panelStyle : undefined"
          @keydown="onTreeKeydown"
        >
          <input
            v-if="filterable"
            v-model="query"
            class="wi-treeselect__filter"
            type="search"
            :placeholder="locale.searchPlaceholder"
            @click.stop
            @keydown="onFilterKeydown"
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
              :active-key="activeKey"
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
