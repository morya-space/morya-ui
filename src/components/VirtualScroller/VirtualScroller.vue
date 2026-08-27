<script setup lang="ts">
import type { VirtualScrollerProps } from './types'
import { computed, ref } from 'vue'

const props = withDefaults(defineProps<VirtualScrollerProps>(), {
  height: 240,
  buffer: 3,
})

const scrollTop = ref(0)

const viewportHeight = computed(() => {
  if (typeof props.height === 'number') return props.height
  const parsed = Number.parseFloat(props.height)
  return Number.isFinite(parsed) ? parsed : 240
})

const totalHeight = computed(() => props.items.length * props.itemSize)

const startIndex = computed(() =>
  Math.max(0, Math.floor(scrollTop.value / props.itemSize) - props.buffer),
)

const endIndex = computed(() => {
  const visible = Math.ceil(viewportHeight.value / props.itemSize) + props.buffer * 2
  return Math.min(props.items.length, startIndex.value + visible)
})

const visibleItems = computed(() =>
  props.items.slice(startIndex.value, endIndex.value).map((item, offset) => ({
    item,
    index: startIndex.value + offset,
  })),
)

const offsetY = computed(() => startIndex.value * props.itemSize)

function onScroll(event: Event) {
  const target = event.target as HTMLElement
  scrollTop.value = target.scrollTop
}
</script>

<template>
  <div
    class="wi-virtualscroller"
    :style="{ height: typeof height === 'number' ? `${height}px` : height }"
    @scroll="onScroll"
  >
    <div class="wi-virtualscroller__spacer" :style="{ height: `${totalHeight}px` }">
      <div class="wi-virtualscroller__content" :style="{ transform: `translateY(${offsetY}px)` }">
        <div
          v-for="entry in visibleItems"
          :key="entry.index"
          class="wi-virtualscroller__item"
          :style="{ height: `${itemSize}px` }"
        >
          <slot name="item" :item="entry.item" :index="entry.index">
            {{ entry.item }}
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>
