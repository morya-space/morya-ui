<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { useWiLocale } from '../../locale'
import { useWiConfig } from '../../shared/config'
import { isOverlayTeleported, resolveOverlayTeleport } from '../../shared/overlay'
import { resolveSizeClass } from '../../shared/types'
import type { TreeSelectNode, TreeSelectProps } from './types'
import TreeSelectNodeItem from './TreeSelectNodeItem.vue'

const props = withDefaults(defineProps<TreeSelectProps>(), {
  modelValue: null,
  placeholder: undefined,
  disabled: false,
  selectionMode: 'single',
  teleport: true,
})

const emit = defineEmits<{
  (event: 'update:modelValue', value: string | null): void
}>()

const config = useWiConfig()
const locale = useWiLocale()
const sizeClass = computed(() => resolveSizeClass(props.size ?? config.value.size))
const open = ref(false)
const root = ref<HTMLElement | null>(null)
const trigger = ref<HTMLElement | null>(null)
const panel = ref<HTMLElement | null>(null)
const panelStyle = ref<Record<string, string>>({})
const expanded = ref<Record<string, boolean>>({})
const teleportTarget = computed(() => resolveOverlayTeleport(props, config.value.appendTo))
const teleported = computed(() => isOverlayTeleported(props, config.value.appendTo))

const displayLabel = computed(() => findLabel(props.options, props.modelValue) ?? props.placeholder ?? locale.value.selectPlaceholder)

function findLabel(nodes: TreeSelectNode[], key: string | null | undefined): string | null {
  if (!key) return null
  for (const node of nodes) {
    if (node.key === key) return node.label
    if (node.children?.length) {
      const nested = findLabel(node.children, key)
      if (nested) return nested
    }
  }
  return null
}

function updatePanelPosition() {
  if (!teleported.value || !trigger.value) return
  const rect = trigger.value.getBoundingClientRect()
  panelStyle.value = {
    left: `${rect.left}px`,
    minWidth: `${rect.width}px`,
    top: `${rect.bottom + 8}px`,
  }
}

function toggle() {
  if (props.disabled) return
  open.value = !open.value
  if (open.value) void nextTick(() => updatePanelPosition())
}

function toggleExpand(key: string) {
  expanded.value = { ...expanded.value, [key]: !expanded.value[key] }
}

function select(node: TreeSelectNode) {
  if (node.disabled) return
  emit('update:modelValue', node.key === props.modelValue ? null : node.key)
  open.value = false
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
      { 'wi-treeselect--disabled': disabled, 'wi-treeselect--open': open },
    ]"
  >
    <button
      ref="trigger"
      type="button"
      class="wi-treeselect__trigger"
      :disabled="disabled"
      :aria-expanded="open"
      aria-haspopup="tree"
      @click="toggle"
    >
      <span class="wi-treeselect__label">{{ displayLabel }}</span>
      <span class="wi-treeselect__caret" aria-hidden="true">▾</span>
    </button>
    <Teleport :to="teleportTarget.to" :disabled="teleportTarget.disabled">
      <Transition name="wi-scale-fade">
        <div
          v-if="open"
          ref="panel"
          class="wi-treeselect__panel"
          :class="{ 'wi-treeselect__panel--teleported': teleported }"
          :style="teleported ? panelStyle : undefined"
        >
          <ul class="wi-treeselect__tree" role="tree">
            <TreeSelectNodeItem
              v-for="node in options"
              :key="node.key"
              :node="node"
              :depth="0"
              :selected-key="modelValue"
              :expanded="expanded"
              @toggle="toggleExpand"
              @select="select"
            />
          </ul>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>
