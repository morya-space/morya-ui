<script setup lang="ts">
import type { DockItem, DockProps } from './types'
import { computed, useSlots } from 'vue'
import { resolveMenuIcon } from '../../shared/menu'
import WiIcon from '../Icon/Icon.vue'

const props = withDefaults(defineProps<DockProps>(), {
  model: () => [],
  position: 'bottom',
})

const slots = useSlots()
const rootClass = computed(() => ['wi-dock', `wi-dock--${props.position}`])

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
    <ul class="wi-dock__list">
      <slot v-if="slots.default" />
      <template v-else>
        <li v-for="(item, index) in model" :key="`${item.label}-${index}`" class="wi-dock__item">
        <button
          type="button"
          class="wi-dock__button"
          :title="item.label"
          :aria-label="item.label"
          :disabled="item.disabled"
          @click="activate(item)"
        >
          <span class="wi-dock__icon" aria-hidden="true">
            <WiIcon v-if="iconOf(item)" :name="iconOf(item)!" size="sm" />
            <template v-else>{{ item.label.slice(0, 1) }}</template>
          </span>
        </button>
      </li>
      </template>
    </ul>
  </nav>
</template>
