<script setup lang="ts">
import type { ContextMenuItem } from './types'
import { ref } from 'vue'
import FlyoutSubmenu from '../../shared/FlyoutSubmenu.vue'
import { menuNodeKey, resolveMenuIcon, resolveMenuIconComponent } from '../../shared/menu'
import MIcon from '../Icon/Icon.vue'
import MScrollbar from '../Scrollbar/Scrollbar.vue'
import ContextMenuNodes from './ContextMenuNodes.vue'

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
  return typeof item.icon === 'string' ? resolveMenuIcon(item.icon) : undefined
}

function iconComponentOf(item: ContextMenuItem) {
  return resolveMenuIconComponent(item.icon)
}

function hasIcon(item: ContextMenuItem) {
  return Boolean(iconOf(item) || iconComponentOf(item))
}

function onSubmenuWrapEnter(index: number, event: MouseEvent) {
  clearHideTimer()
  openIndex.value = index
  const wrap = event.currentTarget as HTMLElement | null
  openAnchor.value = wrap?.querySelector<HTMLElement>('.m-context-menu__item--parent') ?? wrap
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
    <div v-if="item.separator" class="m-context-menu__separator" role="separator" />
    <div
      v-else-if="item.items?.length"
      class="m-context-menu__submenu-wrap"
      @mouseenter="onSubmenuWrapEnter(index, $event)"
      @mouseleave="scheduleClose()"
    >
      <button
        type="button"
        class="m-context-menu__item m-context-menu__item--parent"
        role="menuitem"
        :disabled="item.disabled"
      >
        <span v-if="hasIcon(item)" class="m-context-menu__icon" aria-hidden="true">
          <MIcon v-if="iconOf(item)" :name="iconOf(item)!" size="sm" />
          <component :is="iconComponentOf(item)" v-else-if="iconComponentOf(item)" />
        </span>
        <span class="m-context-menu__label">{{ item.label }}</span>
        <span v-if="item.shortcut" class="m-context-menu__shortcut">{{ item.shortcut }}</span>
        <span class="m-context-menu__caret" aria-hidden="true">
          <MIcon name="chevron-right" size="sm" />
        </span>
      </button>
      <FlyoutSubmenu
        :open="openIndex === index"
        :anchor="openIndex === index ? openAnchor : null"
        panel-class="m-context-menu__submenu"
        @enter="onSubmenuEnter"
        @leave="onSubmenuLeave"
      >
        <MScrollbar
          class="m-context-menu__submenu-scroll"
          fit-content
          wrap-class="m-context-menu__submenu-wrap-inner"
          view-class="m-context-menu__submenu-view"
        >
          <ContextMenuNodes :items="item.items" @activate="$emit('activate', $event)" />
        </MScrollbar>
      </FlyoutSubmenu>
    </div>
    <button
      v-else
      type="button"
      class="m-context-menu__item"
      role="menuitem"
      :disabled="item.disabled"
      @click="$emit('activate', item)"
    >
      <span v-if="hasIcon(item)" class="m-context-menu__icon" aria-hidden="true">
        <MIcon v-if="iconOf(item)" :name="iconOf(item)!" size="sm" />
        <component :is="iconComponentOf(item)" v-else-if="iconComponentOf(item)" />
      </span>
      <span class="m-context-menu__label">{{ item.label }}</span>
      <span v-if="item.shortcut" class="m-context-menu__shortcut">{{ item.shortcut }}</span>
    </button>
  </template>
</template>
