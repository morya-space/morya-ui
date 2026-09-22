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

const scrollBody = ref<InstanceType<typeof ScrollBody> | null>(null)
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

/** Keep `index` in view; no-op when already visible. */
function scrollToIndex(index: number) {
  if (index < 0 || index >= props.items.length) return
  const size = props.itemSize
  const viewport = viewportHeight.value
  const start = index * size
  const end = start + size
  const current = scrollTop.value
  let next = current
  if (start < current) next = start
  else if (end > current + viewport) next = end - viewport
  else return
  next = Math.max(0, Math.min(next, Math.max(0, totalHeight.value - viewport)))
  scrollTop.value = next
  scrollBody.value?.setScrollTop(next)
}

defineExpose({ scrollToIndex })
</script>

<template>
  <ScrollBody
    ref="scrollBody"
    v-bind="rootAttrs"
    root-class="m-virtualscroller m-virtualscroller__scrollbar"
    wrap-class="m-virtualscroller__scroll"
    :wrap-style="rootStyle"
    :role="role"
    :aria-label="ariaLabel"
    @scroll="onScroll"
  >
    <div class="m-virtualscroller__spacer" :style="{ height: `${totalHeight}px` }">
      <div class="m-virtualscroller__content" :style="{ transform: `translateY(${offsetY}px)` }">
        <div
          v-for="entry in visibleItems"
          :key="entry.index"
          class="m-virtualscroller__item"
          :style="{ height: `${itemSize}px` }"
          :data-index="entry.index"
        >
          <slot name="item" :item="entry.item" :index="entry.index">
            {{ entry.item }}
          </slot>
        </div>
      </div>
    </div>
  </ScrollBody>
</template>
