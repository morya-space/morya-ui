<script setup lang="ts">
import type {VNode} from 'vue';
import type { SplitterProps, SplitterSize } from './types'
import { Comment, computed, Fragment, onBeforeUnmount, ref, Text, useSlots,  watch } from 'vue'
import { useWdLocale } from '../../locale'
import {
  clampPx,
  detectSizeMode,
  parseToPx,
  pxToSize,
  sizeToFlexBasis,
} from './size'

const props = withDefaults(defineProps<SplitterProps>(), {
  defaultSize: 50,
  disabled: false,
  resizeTriggerSize: 6,
})

const emit = defineEmits<{
  (event: 'update:size', value: SplitterSize): void
  (event: 'resize', value: SplitterSize): void
  (event: 'drag-start', eventPayload: Event): void
  (event: 'drag-move', eventPayload: Event): void
  (event: 'drag-end', eventPayload: Event): void
}>()

const locale = useWdLocale()
const slots = useSlots()
const root = ref<HTMLElement | null>(null)
const dragging = ref(false)

const resolvedLayout = computed(() => props.layout ?? props.direction ?? 'horizontal')
const isVertical = computed(() => resolvedLayout.value === 'vertical')

const isControlled = computed(() => props.size !== undefined)
const sizeMode = computed(() =>
  detectSizeMode(props.size ?? props.defaultSize, 'percent'),
)

const defaultMin = computed((): SplitterSize => {
  if (props.min !== undefined) return props.min
  return sizeMode.value === 'ratio' ? 0.1 : sizeMode.value === 'px' ? '40px' : 10
})

const defaultMax = computed((): SplitterSize | undefined => {
  if (props.max !== undefined) return props.max
  if (sizeMode.value === 'ratio') return 0.9
  if (sizeMode.value === 'px') return undefined
  return 90
})

const uncontrolled = ref<SplitterSize>(props.defaultSize)
const mergedSize = computed(() => (isControlled.value ? props.size! : uncontrolled.value))

watch(
  () => props.size,
  (value) => {
    if (value !== undefined && !dragging.value) uncontrolled.value = value
  },
)

watch(
  () => props.defaultSize,
  (value) => {
    if (!isControlled.value) uncontrolled.value = value
  },
)

let startPos = 0
let startPx = 0
let usableSize = 0

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

const defaultPanels = computed(() => {
  const children = unwrap(slots.default?.() ?? [])
  return [children[0] ?? null, children[1] ?? null] as const
})

function measureUsable(): number {
  const el = root.value
  if (!el) return 0
  const rect = el.getBoundingClientRect()
  const total = isVertical.value ? rect.height : rect.width
  return Math.max(0, total - props.resizeTriggerSize)
}

function normalizeStyle(style: SplitterProps['pane1Style']) {
  return typeof style === 'string' || style == null ? undefined : style
}

const panel1Style = computed(() => ({
  flex: `0 0 ${sizeToFlexBasis(mergedSize.value, sizeMode.value)}`,
  ...normalizeStyle(props.pane1Style),
}))

const panel2Style = computed(() => normalizeStyle(props.pane2Style))

const gutterStyle = computed(() => ({}))

function commitSize(next: SplitterSize) {
  if (next === mergedSize.value) return
  uncontrolled.value = next
  emit('update:size', next)
  emit('resize', next)
}

function setFromPx(nextPx: number, container: number) {
  const mode = sizeMode.value
  if (container <= 0) return
  const minPx = parseToPx(defaultMin.value, container, detectSizeMode(defaultMin.value, mode))
  const maxSource = defaultMax.value
  const maxPx =
    maxSource === undefined && mode === 'px'
      ? container
      : parseToPx(maxSource ?? (mode === 'ratio' ? 1 : 100), container, detectSizeMode(maxSource ?? 100, mode))
  const clamped = clampPx(nextPx, minPx, maxPx, container)
  commitSize(pxToSize(clamped, container, mode))
}

function onMove(event: MouseEvent | PointerEvent) {
  if (!dragging.value || usableSize <= 0 || props.disabled) return
  const pos = isVertical.value ? event.clientY : event.clientX
  setFromPx(startPx + (pos - startPos), usableSize)
  emit('drag-move', event)
}

function stopDrag(event?: Event) {
  if (!dragging.value) return
  dragging.value = false
  window.removeEventListener('mousemove', onMove, true)
  window.removeEventListener('mouseup', stopDragListener, true)
  window.removeEventListener('pointermove', onMove, true)
  window.removeEventListener('pointerup', stopDragListener, true)
  document.body.style.removeProperty('cursor')
  document.body.style.removeProperty('user-select')
  if (event) emit('drag-end', event)
}

function stopDragListener(event: Event) {
  stopDrag(event)
}

function startDrag(event: MouseEvent | PointerEvent) {
  if (props.disabled) return
  if ('button' in event && event.button > 0) return
  if (!root.value) return

  event.preventDefault()
  usableSize = measureUsable()
  if (usableSize <= 0) return

  startPos = isVertical.value ? event.clientY : event.clientX
  startPx = parseToPx(mergedSize.value, usableSize, sizeMode.value)
  dragging.value = true
  document.body.style.cursor = isVertical.value ? 'row-resize' : 'col-resize'
  document.body.style.userSelect = 'none'
  emit('drag-start', event)

  window.addEventListener('mousemove', onMove, true)
  window.addEventListener('mouseup', stopDragListener, true)
  window.addEventListener('pointermove', onMove, true)
  window.addEventListener('pointerup', stopDragListener, true)
}

function onGutterKeydown(event: KeyboardEvent) {
  if (props.disabled) return
  const mode = sizeMode.value
  let container = measureUsable()

  // Tests / hidden trees may lack geometry; fall back for percent/ratio.
  if (container <= 0 && mode !== 'px') container = 100

  const currentPx = parseToPx(mergedSize.value, container, mode)
  const stepPx = event.shiftKey ? container * 0.05 : mode === 'percent' ? container * 0.01 : container * 0.01

  const apply = (delta: number) => {
    event.preventDefault()
    setFromPx(currentPx + delta, container)
  }

  if (isVertical.value) {
    if (event.key === 'ArrowUp') apply(-stepPx)
    else if (event.key === 'ArrowDown') apply(stepPx)
    return
  }
  if (event.key === 'ArrowLeft') apply(-stepPx)
  else if (event.key === 'ArrowRight') apply(stepPx)
}

const ariaValue = computed(() => {
  const mode = sizeMode.value
  const value = mergedSize.value
  if (mode === 'px' && typeof value === 'string') return Math.round(Number.parseFloat(value))
  if (mode === 'ratio' && typeof value === 'number') return Math.round(value * 100)
  if (typeof value === 'number') return Math.round(value)
  return 0
})

const ariaMin = computed(() => {
  const v = defaultMin.value
  if (typeof v === 'string') return Math.round(Number.parseFloat(v))
  if (sizeMode.value === 'ratio') return Math.round(v * 100)
  return Math.round(v)
})

const ariaMax = computed(() => {
  const v = defaultMax.value
  if (v === undefined) return undefined
  if (typeof v === 'string') return Math.round(Number.parseFloat(v))
  if (sizeMode.value === 'ratio') return Math.round(v * 100)
  return Math.round(v)
})

onBeforeUnmount(() => {
  stopDrag()
})
</script>

<template>
  <div
    ref="root"
    class="wd-splitter"
    :style="{ '--wd-splitter-trigger-size': `${resizeTriggerSize}px` }"
    :class="[
      `wd-splitter--${resolvedLayout}`,
      {
        'wd-splitter--dragging': dragging,
        'wd-splitter--disabled': disabled,
      },
    ]"
    :aria-orientation="isVertical ? 'vertical' : 'horizontal'"
  >
    <div class="wd-splitter__panel" :class="pane1Class" :style="panel1Style">
      <slot v-if="slots.panel1" name="panel1" />
      <slot v-else-if="slots['1']" name="1" />
      <component :is="defaultPanels[0]" v-else-if="defaultPanels[0]" />
    </div>

    <div
      class="wd-splitter__gutter"
      role="separator"
      :tabindex="disabled ? -1 : 0"
      :aria-orientation="isVertical ? 'horizontal' : 'vertical'"
      :aria-valuenow="ariaValue"
      :aria-valuemin="ariaMin"
      :aria-valuemax="ariaMax"
      :aria-disabled="disabled || undefined"
      :aria-label="isVertical ? locale.resizeVertical : locale.resizeHorizontal"
      :style="gutterStyle"
      @pointerdown="startDrag"
      @mousedown="startDrag"
      @keydown="onGutterKeydown"
    >
      <slot name="resize-trigger" />
    </div>

    <div class="wd-splitter__panel wd-splitter__panel--fill" :class="pane2Class" :style="panel2Style">
      <slot v-if="slots.panel2" name="panel2" />
      <slot v-else-if="slots['2']" name="2" />
      <component :is="defaultPanels[1]" v-else-if="defaultPanels[1]" />
    </div>
  </div>
</template>
