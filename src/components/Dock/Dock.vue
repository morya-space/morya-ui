<script setup lang="ts">
import { computed } from 'vue'
import type { DockItem, DockProps } from './types'

const props = withDefaults(defineProps<DockProps>(), {
  model: () => [],
  position: 'bottom',
})

const rootClass = computed(() => ['wi-dock', `wi-dock--${props.position}`])

function activate(item: DockItem) {
  if (item.disabled) return
  item.command?.()
}
</script>

<template>
  <nav :class="rootClass" aria-label="Dock">
    <ul class="wi-dock__list">
      <li v-for="(item, index) in model" :key="`${item.label}-${index}`" class="wi-dock__item">
        <button
          type="button"
          class="wi-dock__button"
          :title="item.label"
          :aria-label="item.label"
          :disabled="item.disabled"
          @click="activate(item)"
        >
          <span class="wi-dock__icon" aria-hidden="true">{{ item.icon ?? item.label.slice(0, 1) }}</span>
        </button>
      </li>
    </ul>
  </nav>
</template>
