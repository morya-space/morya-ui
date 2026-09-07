<script setup lang="ts">
import type { ContextMenuItem } from './types'
import { ref } from 'vue'
import RdIcon from '../Icon/Icon.vue'
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
    <div v-if="item.separator" class="rd-contextmenu__separator" role="separator" />
    <div
      v-else-if="item.items?.length"
      class="rd-contextmenu__submenu-wrap"
      @mouseenter="openIndex = index"
      @mouseleave="openIndex = null"
    >
      <button
        type="button"
        class="rd-contextmenu__item rd-contextmenu__item--parent"
        role="menuitem"
        :disabled="item.disabled"
      >
        <span v-if="iconOf(item)" class="rd-contextmenu__icon" aria-hidden="true">
          <RdIcon :name="iconOf(item)!" size="sm" />
        </span>
        <span class="rd-contextmenu__label">{{ item.label }}</span>
        <span v-if="item.shortcut" class="rd-contextmenu__shortcut">{{ item.shortcut }}</span>
        <span class="rd-contextmenu__caret" aria-hidden="true">
          <RdIcon name="chevron-right" size="sm" />
        </span>
      </button>
      <div v-if="openIndex === index" class="rd-contextmenu__submenu" role="menu">
        <ContextMenuNodes :items="item.items" @activate="$emit('activate', $event)" />
      </div>
    </div>
    <button
      v-else
      type="button"
      class="rd-contextmenu__item"
      role="menuitem"
      :disabled="item.disabled"
      @click="$emit('activate', item)"
    >
      <span v-if="iconOf(item)" class="rd-contextmenu__icon" aria-hidden="true">
        <RdIcon :name="iconOf(item)!" size="sm" />
      </span>
      <span class="rd-contextmenu__label">{{ item.label }}</span>
      <span v-if="item.shortcut" class="rd-contextmenu__shortcut">{{ item.shortcut }}</span>
    </button>
  </template>
</template>
