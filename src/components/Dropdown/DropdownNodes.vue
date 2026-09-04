<script setup lang="ts">
import type { DropdownItem } from './types'
import { ref } from 'vue'
import WdIcon from '../Icon/Icon.vue'
import { menuNodeKey, resolveMenuIcon } from '../../shared/menu'
import DropdownNodes from './DropdownNodes.vue'

const props = defineProps<{
  items: DropdownItem[]
  highlightedValue?: string
}>()

const emit = defineEmits<{
  (event: 'select', item: DropdownItem): void
  (event: 'highlight', value: string | undefined): void
}>()

const openValue = ref<string | null>(null)

function isDivider(item: DropdownItem) {
  return item.separator || item.type === 'divider'
}

function isGroup(item: DropdownItem) {
  return item.type === 'group'
}

function itemKey(item: DropdownItem, index: number) {
  return menuNodeKey(item, index, 'dd')
}

function iconOf(item: DropdownItem) {
  return resolveMenuIcon(item.icon)
}

function onEnter(item: DropdownItem, index: number) {
  if (item.disabled || isDivider(item) || isGroup(item)) return
  emit('highlight', item.value)
  if (item.items?.length) openValue.value = itemKey(item, index)
}

function onLeave() {
  openValue.value = null
}
</script>

<template>
  <template v-for="(item, index) in items" :key="itemKey(item, index)">
    <div v-if="isDivider(item)" class="wd-dropdown__separator" role="separator" />
    <div v-else-if="isGroup(item)" class="wd-dropdown__group">
      <div class="wd-dropdown__group-label">
        {{ item.label }}
      </div>
      <DropdownNodes
        v-if="item.items?.length"
        :items="item.items"
        :highlighted-value="highlightedValue"
        @select="$emit('select', $event)"
        @highlight="$emit('highlight', $event)"
      />
    </div>
    <div
      v-else-if="item.items?.length"
      class="wd-dropdown__submenu-wrap"
      @mouseenter="onEnter(item, index)"
      @mouseleave="onLeave"
    >
      <button
        type="button"
        class="wd-dropdown__item wd-dropdown__item--parent"
        :class="{ 'wd-dropdown__item--highlighted': highlightedValue === item.value }"
        role="menuitem"
        :disabled="item.disabled"
        :aria-haspopup="true"
      >
        <span v-if="iconOf(item)" class="wd-dropdown__icon" aria-hidden="true">
          <WdIcon :name="iconOf(item)!" size="sm" />
        </span>
        <slot name="item" :item="item">
          {{ item.label }}
        </slot>
        <span class="wd-dropdown__caret" aria-hidden="true">
          <WdIcon name="chevron-right" size="sm" />
        </span>
      </button>
      <div v-if="openValue === itemKey(item, index)" class="wd-dropdown__submenu" role="menu">
        <DropdownNodes
          :items="item.items"
          :highlighted-value="highlightedValue"
          @select="$emit('select', $event)"
          @highlight="$emit('highlight', $event)"
        />
      </div>
    </div>
    <button
      v-else
      type="button"
      class="wd-dropdown__item"
      :class="{ 'wd-dropdown__item--highlighted': highlightedValue === item.value }"
      role="menuitem"
      :disabled="item.disabled"
      @mouseenter="!item.disabled && $emit('highlight', item.value)"
      @click="$emit('select', item)"
    >
      <span v-if="iconOf(item)" class="wd-dropdown__icon" aria-hidden="true">
        <WdIcon :name="iconOf(item)!" size="sm" />
      </span>
      <slot name="item" :item="item">
        {{ item.label }}
      </slot>
    </button>
  </template>
</template>
