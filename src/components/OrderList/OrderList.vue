<script setup lang="ts">
import type { OrderListProps } from './types'
import { computed, nextTick, ref, watch } from 'vue'
import { useWdLocale } from '../../locale'
import { useMenuKeyboard } from '../../shared/useMenuKeyboard'
import WdIcon from '../Icon/Icon.vue'

const props = withDefaults(defineProps<OrderListProps>(), {
  modelValue: () => [],
  dataKey: undefined,
  dragdrop: true,
})

const emit = defineEmits<{
  (event: 'update:modelValue', value: unknown[]): void
  (event: 'reorder', value: unknown[]): void
}>()
const locale = useWdLocale()

const resolvedEmptyMessage = computed(
  () => props.emptyMessage ?? locale.value.emptyMessage,
)

const selectedIndex = ref<number | null>(null)
const dragFrom = ref<number | null>(null)
const dropTarget = ref<number | null>(null)
/** Only start HTML5 drag after pressing the grip handle. */
const handleArmed = ref(false)

function itemKey(item: unknown, index: number) {
  if (props.dataKey && item && typeof item === 'object' && props.dataKey in item) {
    return String((item as Record<string, unknown>)[props.dataKey])
  }
  return String(index)
}

const list = ref<HTMLElement | null>(null)

const keyboard = useMenuKeyboard({
  itemCount: () => props.modelValue.length,
})

function select(index: number) {
  selectedIndex.value = index
  keyboard.setActive(index)
}

function itemTabindex(index: number): 0 | -1 {
  if (keyboard.activeIndex.value >= 0) return keyboard.tabindexFor(index)
  return index === (selectedIndex.value ?? 0) ? 0 : -1
}

function focusItem(index: number) {
  list.value
    ?.querySelectorAll<HTMLElement>('.wd-orderlist__item')
    [index]?.focus({ preventScroll: true })
}

function onListKeydown(event: KeyboardEvent) {
  if ((event.ctrlKey || event.metaKey) && (event.key === 'ArrowUp' || event.key === 'ArrowDown')) {
    event.preventDefault()
    move(event.key === 'ArrowUp' ? -1 : 1)
    return
  }
  keyboard.onKeydown(event)
}

watch(keyboard.activeIndex, (index) => {
  if (index < 0) return
  selectedIndex.value = index
  focusItem(index)
})

function commitOrder(next: unknown[]) {
  emit('update:modelValue', next)
  emit('reorder', next)
}

function move(delta: number) {
  if (selectedIndex.value === null) return
  const from = selectedIndex.value
  const to = from + delta
  if (to < 0 || to >= props.modelValue.length) return
  const next = [...props.modelValue]
  const [item] = next.splice(from, 1)
  next.splice(to, 0, item)
  selectedIndex.value = to
  keyboard.setActive(to)
  commitOrder(next)
  void nextTick(() => focusItem(to))
}

function armHandle() {
  if (!props.dragdrop) return
  handleArmed.value = true
}

function onDragStart(index: number, event: DragEvent) {
  if (!props.dragdrop || !handleArmed.value) {
    event.preventDefault()
    return
  }
  dragFrom.value = index
  dropTarget.value = index
  event.dataTransfer?.setData('text/plain', String(index))
  event.dataTransfer!.effectAllowed = 'move'
  select(index)
}

function onDragOver(index: number, event: DragEvent) {
  if (!props.dragdrop || dragFrom.value == null || dragFrom.value === index) return
  event.preventDefault()
  event.dataTransfer!.dropEffect = 'move'
  dropTarget.value = index
}

function onDrop(index: number, event: DragEvent) {
  if (!props.dragdrop || dragFrom.value == null) return
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
  commitOrder(next)
  resetDrag()
}

function onDragEnd() {
  resetDrag()
}

function resetDrag() {
  dragFrom.value = null
  dropTarget.value = null
  handleArmed.value = false
}
</script>

<template>
  <div class="wd-orderlist">
    <div class="wd-orderlist__controls">
      <button type="button" class="wd-orderlist__btn" :aria-label="locale.moveUp" :disabled="selectedIndex === null || selectedIndex <= 0" @click="move(-1)">
        <WdIcon name="chevron-up" size="sm" />
      </button>
      <button type="button" class="wd-orderlist__btn" :aria-label="locale.moveDown" :disabled="selectedIndex === null || selectedIndex >= modelValue.length - 1" @click="move(1)">
        <WdIcon name="chevron-down" size="sm" />
      </button>
    </div>

    <ul
      v-if="modelValue.length"
      ref="list"
      class="wd-orderlist__list"
      :style="listStyle"
      role="listbox"
      :aria-label="locale.selectOption"
      @keydown="onListKeydown"
    >
      <li
        v-for="(item, index) in modelValue"
        :key="itemKey(item, index)"
        class="wd-orderlist__item"
        :class="{
          'wd-orderlist__item--selected': selectedIndex === index,
          'wd-orderlist__ghost': dragdrop && dragFrom === index,
          'wd-orderlist__drop-target': dragdrop && dropTarget === index && dragFrom !== index,
        }"
        role="option"
        :aria-selected="selectedIndex === index"
        :draggable="dragdrop"
        :tabindex="itemTabindex(index)"
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
          class="wd-orderlist__handle"
          :aria-label="locale.dragToReorder"
          tabindex="-1"
          @click.stop
          @pointerdown="armHandle"
        >
          <WdIcon name="grip" size="sm" />
        </button>
        <span class="wd-orderlist__label">
          <slot name="item" :item="item" :index="index">{{ item }}</slot>
        </span>
      </li>
    </ul>
    <div v-else class="wd-orderlist__message" role="status">
      <slot name="empty">
        <p class="wd-orderlist__empty-text">{{ resolvedEmptyMessage }}</p>
      </slot>
    </div>
  </div>
</template>
