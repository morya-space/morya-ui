<script setup lang="ts">
import { computed, ref } from 'vue'
import { useWiLocale } from '../../locale'
import WiIcon from '../Icon/Icon.vue'
import type { PickListProps } from './types'

const props = withDefaults(defineProps<PickListProps>(), {
  source: () => [],
  target: () => [],
})

const emit = defineEmits<{
  (event: 'update:source', value: unknown[]): void
  (event: 'update:target', value: unknown[]): void
}>()

const selectedSource = ref<number[]>([])
const selectedTarget = ref<number[]>([])
const locale = useWiLocale()
const sourceTitle = computed(() => props.sourceHeader ?? locale.value.sourceHeader)
const targetTitle = computed(() => props.targetHeader ?? locale.value.targetHeader)

function itemKey(item: unknown, index: number) {
  if (props.dataKey && item && typeof item === 'object' && props.dataKey in item) {
    return String((item as Record<string, unknown>)[props.dataKey])
  }
  return index
}

function toggleSelection(list: 'source' | 'target', index: number) {
  const selected = list === 'source' ? selectedSource : selectedTarget
  const pos = selected.value.indexOf(index)
  if (pos >= 0) selected.value = selected.value.filter((i) => i !== index)
  else selected.value = [...selected.value, index].sort((a, b) => a - b)
}

function moveToTarget() {
  if (!selectedSource.value.length) return
  const moving = selectedSource.value.map((i) => props.source[i])
  const nextSource = props.source.filter((_, i) => !selectedSource.value.includes(i))
  emit('update:source', nextSource)
  emit('update:target', [...props.target, ...moving])
  selectedSource.value = []
}

function moveToSource() {
  if (!selectedTarget.value.length) return
  const moving = selectedTarget.value.map((i) => props.target[i])
  const nextTarget = props.target.filter((_, i) => !selectedTarget.value.includes(i))
  emit('update:target', nextTarget)
  emit('update:source', [...props.source, ...moving])
  selectedTarget.value = []
}

function moveAllToTarget() {
  if (!props.source.length) return
  emit('update:target', [...props.target, ...props.source])
  emit('update:source', [])
  selectedSource.value = []
}

function moveAllToSource() {
  if (!props.target.length) return
  emit('update:source', [...props.source, ...props.target])
  emit('update:target', [])
  selectedTarget.value = []
}
</script>

<template>
  <div class="wi-picklist">
    <div class="wi-picklist__listbox">
      <div class="wi-picklist__header">{{ sourceTitle }}</div>
      <ul class="wi-picklist__list" role="listbox" aria-multiselectable="true" tabindex="0">
        <li
          v-for="(item, index) in source"
          :key="itemKey(item, index)"
          class="wi-picklist__item"
          :class="{ 'wi-picklist__item--selected': selectedSource.includes(index) }"
          role="option"
          :aria-selected="selectedSource.includes(index)"
          tabindex="0"
          @click="toggleSelection('source', index)"
          @keydown.enter.prevent="toggleSelection('source', index)"
          @keydown.space.prevent="toggleSelection('source', index)"
        >
          <slot name="item" :item="item" :index="index">{{ item }}</slot>
        </li>
      </ul>
    </div>
    <div class="wi-picklist__controls">
      <button type="button" class="wi-picklist__btn" :aria-label="locale.moveAllToTarget" @click="moveAllToTarget">
        <WiIcon name="chevron-right" size="sm" />
        <WiIcon name="chevron-right" size="sm" />
      </button>
      <button type="button" class="wi-picklist__btn" :aria-label="locale.moveToTarget" @click="moveToTarget">
        <WiIcon name="chevron-right" size="sm" />
      </button>
      <button type="button" class="wi-picklist__btn" :aria-label="locale.moveToSource" @click="moveToSource">
        <WiIcon name="chevron-left" size="sm" />
      </button>
      <button type="button" class="wi-picklist__btn" :aria-label="locale.moveAllToSource" @click="moveAllToSource">
        <WiIcon name="chevron-left" size="sm" />
        <WiIcon name="chevron-left" size="sm" />
      </button>
    </div>
    <div class="wi-picklist__listbox">
      <div class="wi-picklist__header">{{ targetTitle }}</div>
      <ul class="wi-picklist__list" role="listbox" aria-multiselectable="true" tabindex="0">
        <li
          v-for="(item, index) in target"
          :key="itemKey(item, index)"
          class="wi-picklist__item"
          :class="{ 'wi-picklist__item--selected': selectedTarget.includes(index) }"
          role="option"
          :aria-selected="selectedTarget.includes(index)"
          tabindex="0"
          @click="toggleSelection('target', index)"
          @keydown.enter.prevent="toggleSelection('target', index)"
          @keydown.space.prevent="toggleSelection('target', index)"
        >
          <slot name="item" :item="item" :index="index">{{ item }}</slot>
        </li>
      </ul>
    </div>
  </div>
</template>
