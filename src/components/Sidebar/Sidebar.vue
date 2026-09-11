<script setup lang="ts">

defineOptions({ inheritAttrs: false })
import type { SidebarItem, SidebarProps } from './types'
import { useRootParts } from '../../shared/useComponentAttrs'
import { computed, useAttrs, useSlots } from 'vue'
import { useMLocale } from '../../locale'
import { resolveMenuIcon } from '../../shared/menu'
import MIcon from '../Icon/Icon.vue'

const props = withDefaults(defineProps<SidebarProps>(), {
  model: () => [],
  collapsed: false,
})
const attrs = useAttrs()
const { rootAttrs } = useRootParts(attrs, () => props.pt)

const locale = useMLocale()

const slots = useSlots()
const rootClass = computed(() => [
  'm-sidebar',
  { 'm-sidebar--collapsed': props.collapsed },
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
  <nav v-bind="rootAttrs" :class="rootClass" :aria-label="locale.sidebar">
    <slot v-if="slots.default" />
    <ul v-else class="m-sidebar__list">
      <li v-for="(item, index) in model" :key="`${item.label}-${index}`" class="m-sidebar__item">
        <button
          type="button"
          class="m-sidebar__link"
          :disabled="item.disabled"
          :title="collapsed ? item.label : undefined"
          @click="activate(item)"
        >
          <span v-if="iconOf(item)" class="m-sidebar__icon" aria-hidden="true">
            <MIcon :name="iconOf(item)!" size="sm" />
          </span>
          <span v-if="!collapsed" class="m-sidebar__label">{{ item.label }}</span>
        </button>
        <ul v-if="!collapsed && item.items?.length" class="m-sidebar__children">
          <li v-for="(child, childIndex) in item.items" :key="`${child.label}-${childIndex}`">
            <button
              type="button"
              class="m-sidebar__link m-sidebar__link--child"
              :disabled="child.disabled"
              @click="activate(child)"
            >
              <span v-if="iconOf(child)" class="m-sidebar__icon" aria-hidden="true">
                <MIcon :name="iconOf(child)!" size="sm" />
              </span>
              <span class="m-sidebar__label">{{ child.label }}</span>
            </button>
          </li>
        </ul>
      </li>
    </ul>
  </nav>
</template>
