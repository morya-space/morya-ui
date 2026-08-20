<script setup lang="ts">
import { ref } from 'vue'
import { useWiLocale } from '../../locale'
import WiIcon from '../Icon/Icon.vue'
import type { OrderListProps } from './types'

const props = withDefaults(defineProps<OrderListProps>(), {
  modelValue: () => [],
  dataKey: undefined,
  dragdrop: true,
})

const emit = defineEmits<{
  (event: 'update:modelValue', value: unknown[]): void
  (event: 'reorder', value: unknown[]): void
}>()
const locale = useWiLocale()

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

function select(index: number) {
  selectedIndex.value = index
}

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
  commitOrder(next)
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
  <div class="wi-orderlist">
    <div class="wi-orderlist__controls">
      <button type="button" class="wi-orderlist__btn" :aria-label="locale.moveUp" @click="move(-1)">
        <WiIcon name="chevron-up" size="sm" />
      </button>
      <button type="button" class="wi-orderlist__btn" :aria-label="locale.moveDown" @click="move(1)">
        <WiIcon name="chevron-down" size="sm" />
      </button>
    </div>

    <ul class="wi-orderlist__list" :style="listStyle" role="listbox">
      <li
        v-for="(item, index) in modelValue"
        :key="itemKey(item, index)"
        class="wi-orderlist__item"
        :class="{
          'wi-orderlist__item--selected': selectedIndex === index,
          'wi-orderlist__ghost': dragdrop && dragFrom === index,
          'wi-orderlist__drop-target': dragdrop && dropTarget === index && dragFrom !== index,
        }"
        role="option"
        :aria-selected="selectedIndex === index"
        :draggable="dragdrop"
        @click="select(index)"
        @dragstart="onDragStart(index, $event)"
        @dragover="onDragOver(index, $event)"
        @drop="onDrop(index, $event)"
        @dragend="onDragEnd"
      >
        <button
          v-if="dragdrop"
          type="button"
          class="wi-orderlist__handle"
          :aria-label="locale.dragToReorder"
          @click.stop
          @pointerdown="armHandle"
        >
          <WiIcon name="grip" size="sm" />
        </button>
        <span class="wi-orderlist__label">
          <slot name="item" :item="item" :index="index">{{ item }}</slot>
        </span>
      </li>
    </ul>
  </div>
</template>
