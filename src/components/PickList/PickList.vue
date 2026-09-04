<script setup lang="ts">
import type { PickListProps } from './types'
import { computed, ref } from 'vue'
import { useWdLocale } from '../../locale'
import WdIcon from '../Icon/Icon.vue'

const props = withDefaults(defineProps<PickListProps>(), {
  source: () => [],
  target: () => [],
})

const emit = defineEmits<{
  (event: 'update:source', value: unknown[]): void
  (event: 'update:target', value: unknown[]): void
}>()

const selectedSource = ref<Array<string | number>>([])
const selectedTarget = ref<Array<string | number>>([])
const locale = useWdLocale()
const sourceTitle = computed(() => props.sourceHeader ?? locale.value.sourceHeader)
const targetTitle = computed(() => props.targetHeader ?? locale.value.targetHeader)
const resolvedEmptyMessage = computed(
  () => props.emptyMessage ?? locale.value.emptyMessage,
)

function itemKey(item: unknown, index: number) {
  if (props.dataKey && item && typeof item === 'object' && props.dataKey in item) {
    return String((item as Record<string, unknown>)[props.dataKey])
  }
  return index
}

function isSelected(list: 'source' | 'target', item: unknown, index: number) {
  const selected = list === 'source' ? selectedSource : selectedTarget
  return selected.value.includes(itemKey(item, index))
}

function toggleSelection(list: 'source' | 'target', item: unknown, index: number) {
  const selected = list === 'source' ? selectedSource : selectedTarget
  const key = itemKey(item, index)
  const pos = selected.value.indexOf(key)
  if (pos >= 0) selected.value = selected.value.filter((k) => k !== key)
  else selected.value = [...selected.value, key]
}

function moveToTarget() {
  if (!selectedSource.value.length) return
  const moving = props.source.filter((item, i) => isSelected('source', item, i))
  const nextSource = props.source.filter((item, i) => !isSelected('source', item, i))
  emit('update:source', nextSource)
  emit('update:target', [...props.target, ...moving])
  selectedSource.value = []
}

function moveToSource() {
  if (!selectedTarget.value.length) return
  const moving = props.target.filter((item, i) => isSelected('target', item, i))
  const nextTarget = props.target.filter((item, i) => !isSelected('target', item, i))
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
  <div class="wd-picklist">
    <div class="wd-picklist__listbox">
      <div class="wd-picklist__header">
        {{ sourceTitle }}
      </div>
      <ul class="wd-picklist__list" role="listbox" aria-multiselectable="true" tabindex="0">
        <li
          v-for="(item, index) in source"
          :key="itemKey(item, index)"
          class="wd-picklist__item"
          :class="{ 'wd-picklist__item--selected': isSelected('source', item, index) }"
          role="option"
          :aria-selected="isSelected('source', item, index)"
          tabindex="0"
          @click="toggleSelection('source', item, index)"
          @keydown.enter.prevent="toggleSelection('source', item, index)"
          @keydown.space.prevent="toggleSelection('source', item, index)"
        >
          <slot name="item" :item="item" :index="index">
            {{ item }}
          </slot>
        </li>
        <li v-if="!source.length" class="wd-picklist__empty" role="status">
          <slot name="empty">
            {{ resolvedEmptyMessage }}
          </slot>
        </li>
      </ul>
    </div>
    <div class="wd-picklist__controls">
      <button type="button" class="wd-picklist__btn" :aria-label="locale.moveAllToTarget" :disabled="!source.length" @click="moveAllToTarget">
        <WdIcon name="chevron-right" size="sm" />
        <WdIcon name="chevron-right" size="sm" />
      </button>
      <button type="button" class="wd-picklist__btn" :aria-label="locale.moveToTarget" :disabled="!selectedSource.length" @click="moveToTarget">
        <WdIcon name="chevron-right" size="sm" />
      </button>
      <button type="button" class="wd-picklist__btn" :aria-label="locale.moveToSource" :disabled="!selectedTarget.length" @click="moveToSource">
        <WdIcon name="chevron-left" size="sm" />
      </button>
      <button type="button" class="wd-picklist__btn" :aria-label="locale.moveAllToSource" :disabled="!target.length" @click="moveAllToSource">
        <WdIcon name="chevron-left" size="sm" />
        <WdIcon name="chevron-left" size="sm" />
      </button>
    </div>
    <div class="wd-picklist__listbox">
      <div class="wd-picklist__header">
        {{ targetTitle }}
      </div>
      <ul class="wd-picklist__list" role="listbox" aria-multiselectable="true" tabindex="0">
        <li
          v-for="(item, index) in target"
          :key="itemKey(item, index)"
          class="wd-picklist__item"
          :class="{ 'wd-picklist__item--selected': isSelected('target', item, index) }"
          role="option"
          :aria-selected="isSelected('target', item, index)"
          tabindex="0"
          @click="toggleSelection('target', item, index)"
          @keydown.enter.prevent="toggleSelection('target', item, index)"
          @keydown.space.prevent="toggleSelection('target', item, index)"
        >
          <slot name="item" :item="item" :index="index">
            {{ item }}
          </slot>
        </li>
        <li v-if="!target.length" class="wd-picklist__empty" role="status">
          <slot name="empty">
            {{ resolvedEmptyMessage }}
          </slot>
        </li>
      </ul>
    </div>
  </div>
</template>
