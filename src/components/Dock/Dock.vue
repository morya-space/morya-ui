<script setup lang="ts">
import { computed } from 'vue'
import type { DockItem, DockProps } from './types'

const props = withDefaults(defineProps<DockProps>(), {
  model: () => [],
  position: 'bottom',
})

const rootClass = computed(() => ['wd-dock', `wd-dock--${props.position}`])

function activate(item: DockItem) {
  if (item.disabled) return
  item.command?.()
}
</script>

<template>
  <nav :class="rootClass" aria-label="Dock">
    <ul class="wd-dock__list">
      <li v-for="(item, index) in model" :key="`${item.label}-${index}`" class="wd-dock__item">
        <button
          type="button"
          class="wd-dock__button"
          :title="item.label"
          :aria-label="item.label"
          :disabled="item.disabled"
          @click="activate(item)"
        >
          <span class="wd-dock__icon" aria-hidden="true">{{ item.icon ?? item.label.slice(0, 1) }}</span>
        </button>
      </li>
    </ul>
  </nav>
</template>
