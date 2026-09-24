<script setup lang="ts">
import type { TreeCheckedKeys } from '../Tree/types'
import type { TreeSelectNode, TreeSelectProps, TreeSelectValue } from './types'
import { computed, nextTick, onBeforeUnmount, ref, useAttrs, useSlots, watch } from 'vue'
import { useMLocale } from '../../locale'
import { useConfiguredSize, useMConfig } from '../../shared/config'
import { isOverlayTeleported, resolveOverlayTeleport } from '../../shared/overlay'
import { computeFloatingOverlayStyle } from '../../shared/overlayPlacement'
import { useFieldParts } from '../../shared/useComponentAttrs'
import { useFieldFeedback } from '../../shared/useFieldFeedback'
import { useFloatingViewportSync } from '../../shared/useFloatingViewportSync'
import { useMenuKeyboard } from '../../shared/useMenuKeyboard'
import { useMId } from '../../shared/useMId'
import { useMotionTransition } from '../../theme/useMotionTransition'
import MIcon from '../Icon/Icon.vue'
import MScrollbar from '../Scrollbar/Scrollbar.vue'
import {
  expandCheckedKeys,
  findNode,
  nodePathLabels,
  projectCheckedKeys,
  setCheckedCascade,
  syncAncestors,
} from '../Tree/checkStrategy'
import { filterTreePrune, toggleTreeExpandedKey } from '../Tree/treeQuery'
import TreeSelectNodeItem from './TreeSelectNodeItem.vue'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<TreeSelectProps>(), {
  transition: undefined,
  modelValue: null,
  placeholder: undefined,
  disabled: false,
  invalid: false,
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

const attrs = useAttrs()
const { rootAttrs, controlAttrs } = useFieldParts(attrs, () => props.pt, { controlKey: 'control' })
const slots = useSlots()
const config = useMConfig()
const { transitionName, transitionCss } = useMotionTransition({
  role: 'popup',
  local: () => props.transition,
  componentName: 'TreeSelect',
  fallback: 'scale-fade',
})
const locale = useMLocale()
const sizeClass = useConfiguredSize('TreeSelect', () => props.size)
const autoFieldId = useMId('m-treeselect')
const fieldId = computed(() => props.id ?? autoFieldId)
const { isInvalid, feedbackText, feedbackIsError } = useFieldFeedback(props)
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
const selectedNode = computed(() => {
  const key = selectedKeys.value[0]
  return key && !isMultiple.value ? findNode(props.options, key) : undefined
})
const renderOption = computed(() =>
  slots.option ? (node: TreeSelectNode) => slots.option?.({ option: node }) : undefined,
)
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
const filteredOptions = computed(() => filterTreePrune(props.options, query.value))

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

const panelId = useMId('m-treeselect-panel')

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
  const options = panel.value?.querySelectorAll<HTMLElement>('.m-treeselect__option')
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

function openPanel(fromKeyboard = false) {
  open.value = true
  void nextTick(() => {
    updatePanelPosition()
    if (fromKeyboard) {
      const selectedIndex = flatNodes.value.findIndex((flat) => selectedKeys.value.includes(flat.node.key))
      if (selectedIndex >= 0) keyboard.setActive(selectedIndex)
      else keyboard.moveFirst()
      if (props.filterable) panel.value?.querySelector<HTMLElement>('.m-treeselect__filter')?.focus()
      else focusActiveNode()
    } else {
      keyboard.setActive(-1)
      if (props.filterable) panel.value?.querySelector<HTMLElement>('.m-treeselect__filter')?.focus()
    }
  })
}

function toggle() {
  if (props.disabled) return
  if (open.value) {
    open.value = false
    return
  }
  openPanel(false)
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
      openPanel(true)
    } else if (event.key === 'Enter') {
      event.preventDefault()
      openPanel(false)
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
      ?.querySelectorAll<HTMLElement>('.m-treeselect__option')
      [index]?.scrollIntoView({ block: 'nearest' })
  }
})

function toggleExpand(key: string) {
  expanded.value = toggleTreeExpandedKey(expanded.value, key, { mode: 'boolean' })
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

function activateNode(node: TreeSelectNode) {
  if (node.disabled) return
  const index = flatNodes.value.findIndex((flat) => flat.node.key === node.key)
  if (index >= 0) keyboard.setActive(index)
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

useFloatingViewportSync(
  () => open.value && teleported.value,
  onViewportChange,
)

watch(open, (isOpen) => {
  if (isOpen) {
    document.addEventListener('click', onDocumentClick)
    document.addEventListener('focusin', onDocumentFocusIn)
  } else {
    query.value = ''
    keyboard.reset()
    document.removeEventListener('click', onDocumentClick)
    document.removeEventListener('focusin', onDocumentFocusIn)
  }
})

onBeforeUnmount(() => {
  document.removeEventListener('click', onDocumentClick)
  document.removeEventListener('focusin', onDocumentFocusIn)
})
</script>

<template>
  <div ref="root" v-bind="rootAttrs" class="m-select-field">
    <label v-if="label" class="m-select-field__label" :for="fieldId">{{ label }}</label>
    <div
      class="m-treeselect"
      :class="[
        `m-treeselect--${sizeClass}`,
        {
          'm-treeselect--disabled': disabled,
          'm-treeselect--open': open,
          'm-treeselect--multiple': isMultiple,
          'm-treeselect--invalid': isInvalid,
        },
      ]"
    >
      <div
        class="m-treeselect__control m-select__control"
        :class="{
          'm-select__control--clearable': showClearButton,
          'm-select__control--open': open,
        }"
      >
        <div
          v-bind="controlAttrs"
          :id="fieldId"
          ref="trigger"
          class="m-treeselect__trigger"
          role="combobox"
          :tabindex="disabled ? -1 : 0"
          :aria-disabled="disabled || undefined"
          :aria-expanded="open"
          :aria-controls="open ? panelId : undefined"
          :aria-invalid="isInvalid || undefined"
          :aria-describedby="feedbackText ? `${fieldId}-help` : undefined"
          aria-haspopup="tree"
          @click="toggle"
          @keydown="onTriggerKeydown"
        >
          <div v-if="isMultiple && selectedTags.length" class="m-treeselect__tags">
            <span v-for="tag in visibleTags" :key="tag.key" class="m-select__tag">
              <span class="m-select__tag-label">{{ tag.label }}</span>
              <button
                type="button"
                class="m-select__tag-remove"
                :aria-label="locale.removeTag"
                :disabled="disabled"
                @click.stop="removeTag(tag.key)"
              >
                <MIcon name="close" size="sm" />
              </button>
            </span>
            <span v-if="hiddenTagCount" class="m-select__tag m-select__tag--more">
              {{ hiddenTagCount > 0 ? `+${hiddenTagCount}` : '' }}
            </span>
          </div>
          <span
            v-else-if="!(slots.value && selectedNode)"
            class="m-treeselect__label"
            :class="{ 'm-treeselect__label--placeholder': !selectedKeys.length }"
          >
            {{ displayLabel }}
          </span>
          <slot v-else name="value" :option="selectedNode" />
        </div>
        <div class="m-select__suffix">
          <button
            v-if="showClearButton"
            class="m-select__clear"
            type="button"
            :aria-label="locale.clear"
            @click="clear"
          >
            <MIcon name="close" class="m-control-affix-icon" />
          </button>
          <span
            class="m-select__indicator"
            :class="{ 'm-select__indicator--open': open }"
            aria-hidden="true"
          >
            <MIcon name="chevron-down" class="m-control-affix-icon" />
          </span>
        </div>
      </div>
      <Teleport :to="teleportTarget.to" :disabled="teleportTarget.disabled">
        <Transition :name="transitionName" :css="transitionCss">
          <div
            v-if="open"
            :id="panelId"
            ref="panel"
            class="m-treeselect__panel"
            :class="{ 'm-treeselect__panel--teleported': teleported }"
            :style="teleported ? panelStyle : undefined"
            @keydown="onTreeKeydown"
          >
            <input
              v-if="filterable"
              v-model="query"
              class="m-treeselect__filter"
              type="search"
              size="1"
              :placeholder="locale.searchPlaceholder"
              @click.stop
              @keydown="onFilterKeydown"
            >
            <MScrollbar
              class="m-treeselect__tree-scroll"
              fit-content
              wrap-class="m-treeselect__tree-wrap"
              view-class="m-treeselect__tree-view"
            >
              <ul class="m-treeselect__tree" role="tree">
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
                  :render-option="renderOption"
                  @toggle="toggleExpand"
                  @select="select"
                  @check="toggleCheck"
                  @activate="activateNode"
                />
              </ul>
            </MScrollbar>
          </div>
        </Transition>
      </Teleport>
    </div>
    <span
      v-if="feedbackText"
      :id="`${fieldId}-help`"
      class="m-select-field__help"
      :class="{ 'm-select-field__help--invalid': feedbackIsError }"
      :role="feedbackIsError ? 'alert' : undefined"
    >
      {{ feedbackText }}
    </span>
  </div>
</template>
