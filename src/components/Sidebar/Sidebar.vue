<script setup lang="ts">
import type { SidebarItem, SidebarProps } from './types'
import { computed, useSlots } from 'vue'
import { useWiLocale } from '../../locale'
import { resolveMenuIcon } from '../../shared/menu'
import WiIcon from '../Icon/Icon.vue'

const props = withDefaults(defineProps<SidebarProps>(), {
  model: () => [],
  collapsed: false,
})
const locale = useWiLocale()

const slots = useSlots()
const rootClass = computed(() => [
  'wi-sidebar',
  { 'wi-sidebar--collapsed': props.collapsed },
])

function activate(item: SidebarItem) {
  if (item.disabled) return
  item.command?.()
}

function iconOf(item: SidebarItem) {
  return resolveMenuIcon(item.icon)
}
</script>

<template>
  <nav :class="rootClass" :aria-label="locale.sidebar">
    <slot v-if="slots.default" />
    <ul v-else class="wi-sidebar__list">
      <li v-for="(item, index) in model" :key="`${item.label}-${index}`" class="wi-sidebar__item">
        <button
          type="button"
          class="wi-sidebar__link"
          :disabled="item.disabled"
          :title="collapsed ? item.label : undefined"
          @click="activate(item)"
        >
          <span v-if="iconOf(item)" class="wi-sidebar__icon" aria-hidden="true">
            <WiIcon :name="iconOf(item)!" size="sm" />
          </span>
          <span v-if="!collapsed" class="wi-sidebar__label">{{ item.label }}</span>
        </button>
        <ul v-if="!collapsed && item.items?.length" class="wi-sidebar__children">
          <li v-for="(child, childIndex) in item.items" :key="`${child.label}-${childIndex}`">
            <button
              type="button"
              class="wi-sidebar__link wi-sidebar__link--child"
              :disabled="child.disabled"
              @click="activate(child)"
            >
              <span v-if="iconOf(child)" class="wi-sidebar__icon" aria-hidden="true">
                <WiIcon :name="iconOf(child)!" size="sm" />
              </span>
              <span class="wi-sidebar__label">{{ child.label }}</span>
            </button>
          </li>
        </ul>
      </li>
    </ul>
  </nav>
</template>
