<script setup lang="ts">

import type { ScrollbarScrollPayload } from '../Scrollbar/types'
import type { VirtualScrollerProps } from './types'
import { computed, ref, useAttrs } from 'vue'
import ScrollBody from '../../shared/ScrollBody.vue'
import { useRootParts } from '../../shared/useComponentAttrs'
defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<VirtualScrollerProps>(), {
  height: 240,
  buffer: 3,
})
const attrs = useAttrs()
const { rootAttrs } = useRootParts(attrs, () => props.pt)

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

const rootStyle = computed(() => ({
  height: typeof props.height === 'number' ? `${props.height}px` : props.height,
}))

function onScroll(payload: ScrollbarScrollPayload) {
  scrollTop.value = payload.scrollTop
}
</script>

<template>
  <ScrollBody
    v-bind="rootAttrs"
    root-class="m-virtualscroller m-virtualscroller__scrollbar"
    wrap-class="m-virtualscroller__scroll"
    :wrap-style="rootStyle"
    @scroll="onScroll"
  >
    <div class="m-virtualscroller__spacer" :style="{ height: `${totalHeight}px` }">
      <div class="m-virtualscroller__content" :style="{ transform: `translateY(${offsetY}px)` }">
        <div
          v-for="entry in visibleItems"
          :key="entry.index"
          class="m-virtualscroller__item"
          :style="{ height: `${itemSize}px` }"
        >
          <slot name="item" :item="entry.item" :index="entry.index">
            {{ entry.item }}
          </slot>
        </div>
      </div>
    </div>
  </ScrollBody>
</template>
