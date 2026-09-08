<script setup lang="ts">
import type { SidebarItem, SidebarProps } from './types'
import { computed, useSlots } from 'vue'
import { useWkLocale } from '../../locale'
import { resolveMenuIcon } from '../../shared/menu'
import WkIcon from '../Icon/Icon.vue'

const props = withDefaults(defineProps<SidebarProps>(), {
  model: () => [],
  collapsed: false,
})
const locale = useWkLocale()

const slots = useSlots()
const rootClass = computed(() => [
  'wk-sidebar',
  { 'wk-sidebar--collapsed': props.collapsed },
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
    <ul v-else class="wk-sidebar__list">
      <li v-for="(item, index) in model" :key="`${item.label}-${index}`" class="wk-sidebar__item">
        <button
          type="button"
          class="wk-sidebar__link"
          :disabled="item.disabled"
          :title="collapsed ? item.label : undefined"
          @click="activate(item)"
        >
          <span v-if="iconOf(item)" class="wk-sidebar__icon" aria-hidden="true">
            <WkIcon :name="iconOf(item)!" size="sm" />
          </span>
          <span v-if="!collapsed" class="wk-sidebar__label">{{ item.label }}</span>
        </button>
        <ul v-if="!collapsed && item.items?.length" class="wk-sidebar__children">
          <li v-for="(child, childIndex) in item.items" :key="`${child.label}-${childIndex}`">
            <button
              type="button"
              class="wk-sidebar__link wk-sidebar__link--child"
              :disabled="child.disabled"
              @click="activate(child)"
            >
              <span v-if="iconOf(child)" class="wk-sidebar__icon" aria-hidden="true">
                <WkIcon :name="iconOf(child)!" size="sm" />
              </span>
              <span class="wk-sidebar__label">{{ child.label }}</span>
            </button>
          </li>
        </ul>
      </li>
    </ul>
  </nav>
</template>
