<script setup lang="ts">
import type { ContextMenuItem } from './types'
import { ref } from 'vue'
import MIcon from '../Icon/Icon.vue'
import { menuNodeKey, resolveMenuIcon } from '../../shared/menu'
import ContextMenuNodes from './ContextMenuNodes.vue'
import MScrollbar from '../Scrollbar/Scrollbar.vue'
import FlyoutSubmenu from '../../shared/FlyoutSubmenu.vue'

const props = defineProps<{ items: ContextMenuItem[] }>()
const emit = defineEmits<{ (event: 'activate', item: ContextMenuItem): void }>()
const openIndex = ref<number | null>(null)
const openAnchor = ref<HTMLElement | null>(null)
let hideTimer: ReturnType<typeof setTimeout> | undefined

function clearHideTimer() {
  if (hideTimer) clearTimeout(hideTimer)
  hideTimer = undefined
}

function scheduleClose() {
  clearHideTimer()
  hideTimer = setTimeout(() => {
    openIndex.value = null
    openAnchor.value = null
  }, 150)
}

function itemKey(item: ContextMenuItem, index: number) {
  return menuNodeKey(item, index, 'cm')
}

function iconOf(item: ContextMenuItem) {
  return resolveMenuIcon(item.icon)
}

function onSubmenuWrapEnter(index: number, event: MouseEvent) {
  clearHideTimer()
  openIndex.value = index
  const wrap = event.currentTarget as HTMLElement | null
  openAnchor.value = wrap?.querySelector<HTMLElement>('.m-contextmenu__item--parent') ?? wrap
}

function onSubmenuEnter() {
  clearHideTimer()
}

function onSubmenuLeave() {
  scheduleClose()
}
</script>

<template>
  <template v-for="(item, index) in items" :key="itemKey(item, index)">
    <div v-if="item.separator" class="m-contextmenu__separator" role="separator" />
    <div
      v-else-if="item.items?.length"
      class="m-contextmenu__submenu-wrap"
      @mouseenter="onSubmenuWrapEnter(index, $event)"
      @mouseleave="scheduleClose()"
    >
      <button
        type="button"
        class="m-contextmenu__item m-contextmenu__item--parent"
        role="menuitem"
        :disabled="item.disabled"
      >
        <span v-if="iconOf(item)" class="m-contextmenu__icon" aria-hidden="true">
          <MIcon :name="iconOf(item)!" size="sm" />
        </span>
        <span class="m-contextmenu__label">{{ item.label }}</span>
        <span v-if="item.shortcut" class="m-contextmenu__shortcut">{{ item.shortcut }}</span>
        <span class="m-contextmenu__caret" aria-hidden="true">
          <MIcon name="chevron-right" size="sm" />
        </span>
      </button>
      <FlyoutSubmenu
        :open="openIndex === index"
        :anchor="openIndex === index ? openAnchor : null"
        panel-class="m-contextmenu__submenu"
        @enter="onSubmenuEnter"
        @leave="onSubmenuLeave"
      >
        <MScrollbar
          class="m-contextmenu__submenu-scroll"
          fit-content
          wrap-class="m-contextmenu__submenu-wrap-inner"
          view-class="m-contextmenu__submenu-view"
        >
          <ContextMenuNodes :items="item.items" @activate="$emit('activate', $event)" />
        </MScrollbar>
      </FlyoutSubmenu>
    </div>
    <button
      v-else
      type="button"
      class="m-contextmenu__item"
      role="menuitem"
      :disabled="item.disabled"
      @click="$emit('activate', item)"
    >
      <span v-if="iconOf(item)" class="m-contextmenu__icon" aria-hidden="true">
        <MIcon :name="iconOf(item)!" size="sm" />
      </span>
      <span class="m-contextmenu__label">{{ item.label }}</span>
      <span v-if="item.shortcut" class="m-contextmenu__shortcut">{{ item.shortcut }}</span>
    </button>
  </template>
</template>
