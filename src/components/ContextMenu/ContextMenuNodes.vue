<script setup lang="ts">
import type { ContextMenuItem } from './types'
import { ref } from 'vue'
import WiIcon from '../Icon/Icon.vue'
import { menuNodeKey, resolveMenuIcon } from '../../shared/menu'
import ContextMenuNodes from './ContextMenuNodes.vue'

const props = defineProps<{ items: ContextMenuItem[] }>()
const emit = defineEmits<{ (event: 'activate', item: ContextMenuItem): void }>()
const openIndex = ref<number | null>(null)

function itemKey(item: ContextMenuItem, index: number) {
  return menuNodeKey(item, index, 'cm')
}

function iconOf(item: ContextMenuItem) {
  return resolveMenuIcon(item.icon)
}
</script>

<template>
  <template v-for="(item, index) in items" :key="itemKey(item, index)">
    <div v-if="item.separator" class="wi-contextmenu__separator" role="separator" />
    <div
      v-else-if="item.items?.length"
      class="wi-contextmenu__submenu-wrap"
      @mouseenter="openIndex = index"
      @mouseleave="openIndex = null"
    >
      <button
        type="button"
        class="wi-contextmenu__item wi-contextmenu__item--parent"
        role="menuitem"
        :disabled="item.disabled"
      >
        <span v-if="iconOf(item) || item.icon" class="wi-contextmenu__icon" aria-hidden="true">
          <WiIcon v-if="iconOf(item)" :name="iconOf(item)!" size="sm" />
          <template v-else>{{ item.icon }}</template>
        </span>
        {{ item.label }}
        <span class="wi-contextmenu__caret" aria-hidden="true">▸</span>
      </button>
      <div v-if="openIndex === index" class="wi-contextmenu__submenu" role="menu">
        <ContextMenuNodes :items="item.items" @activate="$emit('activate', $event)" />
      </div>
    </div>
    <button
      v-else
      type="button"
      class="wi-contextmenu__item"
      role="menuitem"
      :disabled="item.disabled"
      @click="$emit('activate', item)"
    >
      <span v-if="iconOf(item) || item.icon" class="wi-contextmenu__icon" aria-hidden="true">
        <WiIcon v-if="iconOf(item)" :name="iconOf(item)!" size="sm" />
        <template v-else>{{ item.icon }}</template>
      </span>
      {{ item.label }}
    </button>
  </template>
</template>
