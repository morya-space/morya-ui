<script setup lang="ts">
import type { SidebarItem, SidebarProps } from './types'
import { computed, useSlots } from 'vue'
import { useRdLocale } from '../../locale'
import { resolveMenuIcon } from '../../shared/menu'
import RdIcon from '../Icon/Icon.vue'

const props = withDefaults(defineProps<SidebarProps>(), {
  model: () => [],
  collapsed: false,
})
const locale = useRdLocale()

const slots = useSlots()
const rootClass = computed(() => [
  'rd-sidebar',
  { 'rd-sidebar--collapsed': props.collapsed },
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
    <ul v-else class="rd-sidebar__list">
      <li v-for="(item, index) in model" :key="`${item.label}-${index}`" class="rd-sidebar__item">
        <button
          type="button"
          class="rd-sidebar__link"
          :disabled="item.disabled"
          :title="collapsed ? item.label : undefined"
          @click="activate(item)"
        >
          <span v-if="iconOf(item)" class="rd-sidebar__icon" aria-hidden="true">
            <RdIcon :name="iconOf(item)!" size="sm" />
          </span>
          <span v-if="!collapsed" class="rd-sidebar__label">{{ item.label }}</span>
        </button>
        <ul v-if="!collapsed && item.items?.length" class="rd-sidebar__children">
          <li v-for="(child, childIndex) in item.items" :key="`${child.label}-${childIndex}`">
            <button
              type="button"
              class="rd-sidebar__link rd-sidebar__link--child"
              :disabled="child.disabled"
              @click="activate(child)"
            >
              <span v-if="iconOf(child)" class="rd-sidebar__icon" aria-hidden="true">
                <RdIcon :name="iconOf(child)!" size="sm" />
              </span>
              <span class="rd-sidebar__label">{{ child.label }}</span>
            </button>
          </li>
        </ul>
      </li>
    </ul>
  </nav>
</template>
