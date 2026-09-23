<script setup lang="ts">
import type { DropdownItem } from './types'
import { ref } from 'vue'
import FlyoutSubmenu from '../../shared/FlyoutSubmenu.vue'
import { menuNodeKey, resolveMenuIcon } from '../../shared/menu'
import MIcon from '../Icon/Icon.vue'
import MScrollbar from '../Scrollbar/Scrollbar.vue'
import DropdownNodes from './DropdownNodes.vue'

const props = defineProps<{
  items: DropdownItem[]
  highlightedValue?: string
}>()

const emit = defineEmits<{
  (event: 'select', item: DropdownItem): void
  (event: 'highlight', value: string | undefined): void
  /* Submenu panels are teleported out of the menu DOM, so the root Dropdown
     cannot see hover on them; forward enter/leave up the recursion chain to
     keep hover-trigger menus from closing while a submenu is hovered. */
  (event: 'submenuEnter'): void
  (event: 'submenuLeave'): void
}>()

/* Explicit slot typing: the recursive self-reference would otherwise make the
   forwarded #item slot props circular and uninferable. */
defineSlots<{
  item?: (props: { item: DropdownItem }) => unknown
}>()

const openValue = ref<string | null>(null)
const openAnchor = ref<HTMLElement | null>(null)
let hideTimer: ReturnType<typeof setTimeout> | undefined

function clearHideTimer() {
  if (hideTimer) clearTimeout(hideTimer)
  hideTimer = undefined
}

function scheduleClose() {
  clearHideTimer()
  hideTimer = setTimeout(() => {
    openValue.value = null
    openAnchor.value = null
  }, 150)
}

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

function onEnter(item: DropdownItem, index: number, event: MouseEvent) {
  if (item.disabled || isDivider(item) || isGroup(item)) return
  clearHideTimer()
  emit('highlight', item.value)
  if (!item.items?.length) return
  openValue.value = itemKey(item, index)
  const wrap = event.currentTarget as HTMLElement | null
  openAnchor.value = wrap?.querySelector<HTMLElement>('.m-dropdown__item--parent') ?? wrap
}

function onLeave() {
  scheduleClose()
}

function onSubmenuEnter() {
  clearHideTimer()
  emit('submenuEnter')
}

function onSubmenuLeave() {
  scheduleClose()
  emit('submenuLeave')
}
</script>

<template>
  <template v-for="(item, index) in items" :key="itemKey(item, index)">
    <div v-if="isDivider(item)" class="m-dropdown__separator" role="separator" />
    <div v-else-if="isGroup(item)" class="m-dropdown__group">
      <div class="m-dropdown__group-label">
        {{ item.label }}
      </div>
      <DropdownNodes
        v-if="item.items?.length"
        :items="item.items"
        :highlighted-value="highlightedValue"
        @select="$emit('select', $event)"
        @highlight="$emit('highlight', $event)"
        @submenu-enter="onSubmenuEnter"
        @submenu-leave="onSubmenuLeave"
      >
        <template v-if="$slots.item" #item="{ item: childItem }">
          <slot name="item" :item="childItem" />
        </template>
      </DropdownNodes>
    </div>
    <div
      v-else-if="item.items?.length"
      class="m-dropdown__submenu-wrap"
      @mouseenter="onEnter(item, index, $event)"
      @mouseleave="onLeave"
    >
      <button
        type="button"
        class="m-dropdown__item m-dropdown__item--parent"
        :class="{ 'm-dropdown__item--highlighted': highlightedValue === item.value }"
        role="menuitem"
        :disabled="item.disabled"
        :aria-haspopup="true"
      >
        <span v-if="iconOf(item)" class="m-dropdown__icon" aria-hidden="true">
          <MIcon :name="iconOf(item)!" size="sm" />
        </span>
        <slot name="item" :item="item">
          {{ item.label }}
        </slot>
        <span class="m-dropdown__caret" aria-hidden="true">
          <MIcon name="chevron-right" size="sm" />
        </span>
      </button>
      <FlyoutSubmenu
        :open="openValue === itemKey(item, index)"
        :anchor="openValue === itemKey(item, index) ? openAnchor : null"
        panel-class="m-dropdown__submenu"
        @enter="onSubmenuEnter"
        @leave="onSubmenuLeave"
      >
        <MScrollbar
          class="m-dropdown__submenu-scroll"
          fit-content
          wrap-class="m-dropdown__submenu-wrap-inner"
          view-class="m-dropdown__submenu-view"
        >
          <DropdownNodes
            :items="item.items"
            :highlighted-value="highlightedValue"
            @select="$emit('select', $event)"
            @highlight="$emit('highlight', $event)"
            @submenu-enter="onSubmenuEnter"
            @submenu-leave="onSubmenuLeave"
          >
            <template v-if="$slots.item" #item="{ item: childItem }">
              <slot name="item" :item="childItem" />
            </template>
          </DropdownNodes>
        </MScrollbar>
      </FlyoutSubmenu>
    </div>
    <button
      v-else
      type="button"
      class="m-dropdown__item"
      :class="{ 'm-dropdown__item--highlighted': highlightedValue === item.value }"
      role="menuitem"
      :disabled="item.disabled"
      @mouseenter="!item.disabled && $emit('highlight', item.value)"
      @click="$emit('select', item)"
    >
      <span v-if="iconOf(item)" class="m-dropdown__icon" aria-hidden="true">
        <MIcon :name="iconOf(item)!" size="sm" />
      </span>
      <slot name="item" :item="item">
        {{ item.label }}
      </slot>
    </button>
  </template>
</template>
