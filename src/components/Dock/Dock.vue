<script setup lang="ts">
import type { DockItem, DockProps } from './types'
import { computed, useSlots } from 'vue'
import { resolveMenuIcon } from '../../shared/menu'
import WdIcon from '../Icon/Icon.vue'

const props = withDefaults(defineProps<DockProps>(), {
  model: () => [],
  position: 'bottom',
})

const slots = useSlots()
const rootClass = computed(() => ['wd-dock', `wd-dock--${props.position}`])

function activate(item: DockItem) {
  if (item.disabled) return
  item.command?.()
}

function iconOf(item: DockItem) {
  return resolveMenuIcon(item.icon)
}
</script>

<template>
  <nav :class="rootClass" aria-label="Dock">
    <ul class="wd-dock__list">
      <slot v-if="slots.default" />
      <template v-else>
        <li v-for="(item, index) in model" :key="`${item.label}-${index}`" class="wd-dock__item">
        <button
          type="button"
          class="wd-dock__button"
          :title="item.label"
          :aria-label="item.label"
          :disabled="item.disabled"
          @click="activate(item)"
        >
          <span class="wd-dock__icon" aria-hidden="true">
            <WdIcon v-if="iconOf(item)" :name="iconOf(item)!" size="sm" />
            <template v-else>{{ item.label.slice(0, 1) }}</template>
          </span>
        </button>
      </li>
      </template>
    </ul>
  </nav>
</template>
