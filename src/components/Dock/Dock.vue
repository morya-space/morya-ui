<script setup lang="ts">

import type { DockItem, DockProps } from './types'
import { computed, useAttrs, useSlots } from 'vue'
import { resolveMenuIcon, resolveMenuIconComponent } from '../../shared/menu'
import { useRootParts } from '../../shared/useComponentAttrs'
import MIcon from '../Icon/Icon.vue'
defineOptions({ inheritAttrs: false })

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
  return typeof item.icon === 'string' ? resolveMenuIcon(item.icon) : undefined
}

function iconComponentOf(item: DockItem) {
  return resolveMenuIconComponent(item.icon)
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
              <component :is="iconComponentOf(item)" v-else-if="iconComponentOf(item)" />
              <template v-else>{{ item.label.slice(0, 1) }}</template>
            </span>
          </button>
        </li>
      </template>
    </ul>
  </nav>
</template>
