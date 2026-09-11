<script setup lang="ts">

defineOptions({ inheritAttrs: false })
import type { DockItem, DockProps } from './types'
import { useRootParts } from '../../shared/useComponentAttrs'
import { computed, useAttrs, useSlots } from 'vue'
import { resolveMenuIcon } from '../../shared/menu'
import MIcon from '../Icon/Icon.vue'

const props = withDefaults(defineProps<DockProps>(), {
  model: () => [],
  position: 'bottom',
})

const attrs = useAttrs()
const { rootAttrs } = useRootParts(attrs, () => props.pt)

const slots = useSlots()
const rootClass = computed(() => ['m-dock', `m-dock--${props.position}`])

function activate(item: DockItem) {
  if (item.disabled) return
  item.command?.()
}

function iconOf(item: DockItem) {
  return resolveMenuIcon(item.icon)
}
</script>

<template>
  <nav v-bind="rootAttrs" :class="rootClass" aria-label="Dock">
    <ul class="m-dock__list">
      <slot v-if="slots.default" />
      <template v-else>
        <li v-for="(item, index) in model" :key="`${item.label}-${index}`" class="m-dock__item">
        <button
          type="button"
          class="m-dock__button"
          :title="item.label"
          :aria-label="item.label"
          :disabled="item.disabled"
          @click="activate(item)"
        >
          <span class="m-dock__icon" aria-hidden="true">
            <MIcon v-if="iconOf(item)" :name="iconOf(item)!" size="sm" />
            <template v-else>{{ item.label.slice(0, 1) }}</template>
          </span>
        </button>
      </li>
      </template>
    </ul>
  </nav>
</template>
