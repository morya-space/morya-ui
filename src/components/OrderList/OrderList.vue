<script setup lang="ts">
import type { OrderListProps, OrderListReorderPayload } from './types'
import { computed, nextTick, onBeforeUnmount, ref, useAttrs, watch } from 'vue'
import { useMLocale } from '../../locale'
import ScrollBody from '../../shared/ScrollBody.vue'
import { useRootParts } from '../../shared/useComponentAttrs'
import { useMenuKeyboard } from '../../shared/useMenuKeyboard'
import MIcon from '../Icon/Icon.vue'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<OrderListProps>(), {
  modelValue: () => [],
  selection: undefined,
  dataKey: undefined,
  dragdrop: true,
  disabled: false,
})

const emit = defineEmits<{
  (event: 'update:modelValue', value: unknown[]): void
  (event: 'update:selection', value: number | null): void
  (event: 'reorder', payload: OrderListReorderPayload): void
}>()
const attrs = useAttrs()
const { rootAttrs } = useRootParts(attrs, () => props.pt)

const locale = useMLocale()

const resolvedEmptyMessage = computed(
  () => props.emptyMessage ?? locale.value.emptyMessage,
)

/** Internal selection; mirrors `selection` prop when controlled. */
const internalSelection = ref<number | null>(null)
const selectedIndex = computed<number | null>({
  get: () => (props.selection !== undefined ? props.selection : internalSelection.value),
  set: (value) => {
    internalSelection.value = value
    emit('update:selection', value)
  },
})

const dragFrom = ref<number | null>(null)
const dropTarget = ref<number | null>(null)
/** Only start HTML5 drag after pressing the grip handle. */
const handleArmed = ref(false)
/** Custom drag preview element (follows the pointer). */
const dragPreview = ref<HTMLElement | null>(null)
const list = ref<HTMLElement | null>(null)
const scrollBodyRef = ref<InstanceType<typeof ScrollBody> | null>(null)

/** TransitionGroup resolves to a component instance; unwrap its root element. */
function listEl(): HTMLElement | null {
  const value = list.value as unknown as { $el?: HTMLElement } | HTMLElement | null
  if (!value) return null
  return (value as { $el?: HTMLElement }).$el ?? (value as HTMLElement)
}

const canInteract = computed(() => !props.disabled && props.modelValue.length > 0)
const canMoveUp = computed(
  () => canInteract.value && selectedIndex.value !== null && selectedIndex.value > 0,
)
const canMoveDown = computed(
  () =>
    canInteract.value
    && selectedIndex.value !== null
    && selectedIndex.value < props.modelValue.length - 1,
)

function itemKey(item: unknown, index: number) {
  if (props.dataKey && item && typeof item === 'object' && props.dataKey in item) {
    return String((item as Record<string, unknown>)[props.dataKey])
  }
  return String(index)
}

const keyboard = useMenuKeyboard({
  itemCount: () => props.modelValue.length,
  enabled: () => !props.disabled,
})

function select(index: number) {
  if (props.disabled) return
  selectedIndex.value = index
  keyboard.setActive(index)
}

function itemTabindex(index: number): 0 | -1 {
  if (keyboard.activeIndex.value >= 0) return keyboard.tabindexFor(index)
  return index === (selectedIndex.value ?? 0) ? 0 : -1
}

function focusItem(index: number) {
  listEl()
    ?.querySelectorAll<HTMLElement>('.m-orderlist__item')
    [index]?.focus({ preventScroll: true })
}

function onListKeydown(event: KeyboardEvent) {
  if (props.disabled) return
  const mod = event.ctrlKey || event.metaKey
  if (mod && (event.key === 'ArrowUp' || event.key === 'ArrowDown')) {
    event.preventDefault()
    moveBy(event.key === 'ArrowUp' ? -1 : 1)
    return
  }
  if (mod && (event.key === 'Home' || event.key === 'End')) {
    event.preventDefault()
    moveTo(event.key === 'Home' ? 0 : props.modelValue.length - 1)
    return
  }
  keyboard.onKeydown(event)
}

watch(keyboard.activeIndex, (index) => {
  if (index < 0) return
  selectedIndex.value = index
  focusItem(index)
})

function commitOrder(next: unknown[], from: number, to: number) {
  emit('update:modelValue', next)
  emit('reorder', { item: next[to], from, to })
}

/** Move the selected item by a relative delta (button / Ctrl+Arrow). */
function moveBy(delta: number) {
  if (selectedIndex.value === null || !canInteract.value) return
  const from = selectedIndex.value
  moveTo(from + delta)
}

/** Move the selected item to an absolute index (button / Ctrl+Home/End / drop). */
function moveTo(to: number) {
  if (selectedIndex.value === null || !canInteract.value) return
  const from = selectedIndex.value
  const clamped = Math.max(0, Math.min(props.modelValue.length - 1, to))
  if (clamped === from) return
  const next = [...props.modelValue]
  const [item] = next.splice(from, 1)
  next.splice(clamped, 0, item)
  selectedIndex.value = clamped
  keyboard.setActive(clamped)
  commitOrder(next, from, clamped)
  void nextTick(() => focusItem(clamped))
}

/* —— Drag and drop —— */

function armHandle() {
  if (!props.dragdrop || props.disabled) return
  handleArmed.value = true
}

function makeDragPreview(index: number): HTMLElement | null {
  const source = listEl()?.querySelectorAll<HTMLElement>('.m-orderlist__item')[index]
  if (!source) return null
  const rect = source.getBoundingClientRect()
  const clone = source.cloneNode(true) as HTMLElement
  clone.classList.add('m-orderlist__drag-preview')
  clone.style.width = `${rect.width}px`
  clone.style.height = `${rect.height}px`
  document.body.appendChild(clone)
  return clone
}

function onDragStart(index: number, event: DragEvent) {
  if (!props.dragdrop || props.disabled || !handleArmed.value) {
    event.preventDefault()
    return
  }
  dragFrom.value = index
  dropTarget.value = index
  event.dataTransfer?.setData('text/plain', String(index))
  event.dataTransfer!.effectAllowed = 'move'
  const preview = makeDragPreview(index)
  if (preview && typeof event.dataTransfer?.setDragImage === 'function') {
    dragPreview.value = preview
    event.dataTransfer.setDragImage(preview, 20, 16)
  } else if (preview) {
    preview.remove()
  }
  select(index)
}

/** Auto-scroll the list when dragging near its top/bottom edge. */
function autoScrollOnDrag(event: DragEvent) {
  const wrap = scrollBodyRef.value?.wrapRef
  if (!wrap) return
  const rect = wrap.getBoundingClientRect()
  const threshold = 32
  const step = 12
  if (event.clientY < rect.top + threshold) {
    wrap.scrollTop -= step
  } else if (event.clientY > rect.bottom - threshold) {
    wrap.scrollTop += step
  }
}

function onDragOver(index: number, event: DragEvent) {
  if (!props.dragdrop || props.disabled || dragFrom.value == null) return
  autoScrollOnDrag(event)
  if (dragFrom.value === index) return
  event.preventDefault()
  event.dataTransfer!.dropEffect = 'move'
  dropTarget.value = index
}

function onDrop(index: number, event: DragEvent) {
  if (!props.dragdrop || props.disabled || dragFrom.value == null) return
  event.preventDefault()
  const from = dragFrom.value
  if (from === index) {
    resetDrag()
    return
  }
  const next = [...props.modelValue]
  const [item] = next.splice(from, 1)
  next.splice(index, 0, item)
  selectedIndex.value = index
  keyboard.setActive(index)
  commitOrder(next, from, index)
  resetDrag()
}

function onDragEnd() {
  resetDrag()
}

function resetDrag() {
  dragFrom.value = null
  dropTarget.value = null
  handleArmed.value = false
  if (dragPreview.value) {
    dragPreview.value.remove()
    dragPreview.value = null
  }
}

onBeforeUnmount(() => {
  if (dragPreview.value) {
    dragPreview.value.remove()
    dragPreview.value = null
  }
})
</script>

<template>
  <div
    v-bind="rootAttrs"
    class="m-orderlist"
    :class="{ 'm-orderlist--disabled': disabled }"
  >
    <div class="m-orderlist__controls">
      <button
        type="button"
        class="m-orderlist__btn"
        :aria-label="locale.moveTop"
        :disabled="!canMoveUp"
        @click="moveTo(0)"
      >
        <MIcon name="chevrons-up" size="sm" />
      </button>
      <button
        type="button"
        class="m-orderlist__btn"
        :aria-label="locale.moveUp"
        :disabled="!canMoveUp"
        @click="moveBy(-1)"
      >
        <MIcon name="chevron-up" size="sm" />
      </button>
      <button
        type="button"
        class="m-orderlist__btn"
        :aria-label="locale.moveDown"
        :disabled="!canMoveDown"
        @click="moveBy(1)"
      >
        <MIcon name="chevron-down" size="sm" />
      </button>
      <button
        type="button"
        class="m-orderlist__btn"
        :aria-label="locale.moveBottom"
        :disabled="!canMoveDown"
        @click="moveTo(modelValue.length - 1)"
      >
        <MIcon name="chevrons-down" size="sm" />
      </button>
    </div>

    <ScrollBody
      v-if="modelValue.length"
      ref="scrollBodyRef"
      root-class="m-orderlist__scrollbar"
      wrap-class="m-orderlist__list"
      :wrap-style="listStyle"
    >
      <TransitionGroup
        ref="list"
        tag="ul"
        name="m-orderlist"
        class="m-orderlist__options"
        role="listbox"
        tabindex="0"
        :aria-label="locale.selectOption"
        :aria-disabled="disabled || undefined"
        @keydown="onListKeydown"
      >
        <li
          v-for="(item, index) in modelValue"
          :key="itemKey(item, index)"
          class="m-orderlist__item"
          :class="{
            'm-orderlist__item--selected': selectedIndex === index,
            'm-orderlist__item--disabled': disabled,
            'm-orderlist__ghost': dragdrop && dragFrom === index,
            'm-orderlist__drop-target': dragdrop && dropTarget === index && dragFrom !== index,
            'm-orderlist__drop-before':
              dragdrop && dropTarget === index && dragFrom !== null && dragFrom > index,
            'm-orderlist__drop-after':
              dragdrop && dropTarget === index && dragFrom !== null && dragFrom < index,
          }"
          role="option"
          :aria-selected="selectedIndex === index"
          :draggable="dragdrop && !disabled"
          :tabindex="disabled ? -1 : itemTabindex(index)"
          @click="select(index)"
          @focus="select(index)"
          @dragstart="onDragStart(index, $event)"
          @dragover="onDragOver(index, $event)"
          @drop="onDrop(index, $event)"
          @dragend="onDragEnd"
        >
          <button
            v-if="dragdrop"
            type="button"
            class="m-orderlist__handle"
            :aria-label="locale.dragToReorder"
            :disabled="disabled"
            tabindex="-1"
            @click.stop
            @pointerdown="armHandle"
          >
            <MIcon name="grip" size="sm" />
          </button>
          <span class="m-orderlist__label">
            <slot
              name="item"
              :item="item"
              :index="index"
              :selected="selectedIndex === index"
              :dragging="dragFrom === index"
            >{{ item }}</slot>
          </span>
        </li>
      </TransitionGroup>
    </ScrollBody>
    <div v-else class="m-orderlist__message" role="status">
      <slot name="empty">
        <p class="m-orderlist__empty-text">
          {{ resolvedEmptyMessage }}
        </p>
      </slot>
    </div>
  </div>
</template>
