<script setup lang="ts">
import { Comment, Fragment, Text, computed, onBeforeUnmount, ref, useSlots, watch, type VNode } from 'vue'
import { useWdLocale } from '../../locale'
import type { SplitterProps } from './types'

const props = withDefaults(defineProps<SplitterProps>(), {
  layout: 'horizontal',
  size: 50,
  min: 10,
  max: 90,
})

const emit = defineEmits<{
  (event: 'update:size', value: number): void
  (event: 'resize', value: number): void
}>()

const locale = useWdLocale()
const slots = useSlots()
const root = ref<HTMLElement | null>(null)
const dragging = ref(false)
const primarySize = ref(clamp(props.size, props.min, props.max))

let startPos = 0
let startPct = 50
let totalSize = 0

watch(
  () => props.size,
  (size) => {
    if (dragging.value) return
    primarySize.value = clamp(size, props.min, props.max)
  },
)

function unwrap(nodes: VNode[]): VNode[] {
  const result: VNode[] = []
  for (const node of nodes) {
    if (node.type === Comment) continue
    if (node.type === Text && !String(node.children ?? '').trim()) continue
    if (node.type === Fragment && Array.isArray(node.children)) {
      result.push(...unwrap(node.children as VNode[]))
      continue
    }
    result.push(node)
  }
  return result
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

const useNamedPanels = computed(() => Boolean(slots.panel1 || slots.panel2))

const defaultPanels = computed(() => {
  const children = unwrap(slots.default?.() ?? [])
  return [children[0] ?? null, children[1] ?? null] as const
})

const isVertical = computed(() => props.layout === 'vertical')

const panel1Style = computed(() => ({
  flex: `0 0 ${primarySize.value}%`,
}))

function setSize(next: number) {
  const value = clamp(Number(next.toFixed(1)), props.min, props.max)
  if (value === primarySize.value) return
  primarySize.value = value
  emit('update:size', value)
  emit('resize', value)
}

function onMove(event: MouseEvent | PointerEvent) {
  if (!dragging.value || totalSize <= 0) return
  const pos = isVertical.value ? event.clientY : event.clientX
  setSize(startPct + ((pos - startPos) / totalSize) * 100)
}

function stopDrag() {
  if (!dragging.value) return
  dragging.value = false
  window.removeEventListener('mousemove', onMove, true)
  window.removeEventListener('mouseup', stopDrag, true)
  window.removeEventListener('pointermove', onMove, true)
  window.removeEventListener('pointerup', stopDrag, true)
  document.body.style.removeProperty('cursor')
  document.body.style.removeProperty('user-select')
}

function startDrag(event: MouseEvent | PointerEvent) {
  if ('button' in event && event.button > 0) return
  const el = (event.currentTarget as HTMLElement | null)?.parentElement ?? root.value
  if (!el) return

  event.preventDefault()
  const rect = el.getBoundingClientRect()
  totalSize = isVertical.value ? rect.height : rect.width
  if (totalSize <= 0) return

  startPos = isVertical.value ? event.clientY : event.clientX
  startPct = primarySize.value
  dragging.value = true
  document.body.style.cursor = isVertical.value ? 'row-resize' : 'col-resize'
  document.body.style.userSelect = 'none'

  window.addEventListener('mousemove', onMove, true)
  window.addEventListener('mouseup', stopDrag, true)
  window.addEventListener('pointermove', onMove, true)
  window.addEventListener('pointerup', stopDrag, true)
}

function onGutterKeydown(event: KeyboardEvent) {
  const step = event.shiftKey ? 5 : 1
  if (isVertical.value) {
    if (event.key === 'ArrowUp') {
      event.preventDefault()
      setSize(primarySize.value - step)
    } else if (event.key === 'ArrowDown') {
      event.preventDefault()
      setSize(primarySize.value + step)
    }
    return
  }
  if (event.key === 'ArrowLeft') {
    event.preventDefault()
    setSize(primarySize.value - step)
  } else if (event.key === 'ArrowRight') {
    event.preventDefault()
    setSize(primarySize.value + step)
  }
}

onBeforeUnmount(() => {
  stopDrag()
})
</script>

<template>
  <div
    ref="root"
    class="wd-splitter"
    :class="[
      `wd-splitter--${layout}`,
      { 'wd-splitter--dragging': dragging },
    ]"
    :aria-orientation="isVertical ? 'vertical' : 'horizontal'"
  >
    <div class="wd-splitter__panel" :style="panel1Style">
      <slot v-if="useNamedPanels" name="panel1" />
      <component :is="defaultPanels[0]" v-else-if="defaultPanels[0]" />
    </div>
    <div
      class="wd-splitter__gutter"
      role="separator"
      tabindex="0"
      :aria-orientation="isVertical ? 'horizontal' : 'vertical'"
      :aria-valuenow="Math.round(primarySize)"
      :aria-valuemin="min"
      :aria-valuemax="max"
      :aria-label="isVertical ? locale.resizeVertical : locale.resizeHorizontal"
      @pointerdown="startDrag"
      @mousedown="startDrag"
      @keydown="onGutterKeydown"
    />
    <div class="wd-splitter__panel wd-splitter__panel--fill">
      <slot v-if="useNamedPanels" name="panel2" />
      <component :is="defaultPanels[1]" v-else-if="defaultPanels[1]" />
    </div>
  </div>
</template>
