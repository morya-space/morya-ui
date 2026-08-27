<script setup lang="ts">
import type { CarouselProps } from './types'
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { useWiLocale } from '../../locale'

const props = withDefaults(defineProps<CarouselProps>(), {
  numVisible: 1,
  circular: false,
  autoplay: false,
  interval: 3000,
  showArrows: true,
  showIndicators: true,
})

const emit = defineEmits<{
  (event: 'update:page', value: number): void
}>()

const page = ref(0)
const locale = useWiLocale()
let timer: ReturnType<typeof setInterval> | null = null

const maxPage = computed(() => Math.max(0, props.value.length - props.numVisible))
const pages = computed(() => Array.from({ length: maxPage.value + 1 }, (_, index) => index))

const visibleItems = computed(() => {
  const start = page.value
  return props.value.slice(start, start + props.numVisible).map((item, offset) => ({
    item,
    index: start + offset,
  }))
})

function go(next: number) {
  let target = next
  if (props.circular) {
    const span = maxPage.value + 1
    target = ((next % span) + span) % span
  } else {
    target = Math.min(maxPage.value, Math.max(0, next))
  }
  page.value = target
  emit('update:page', target)
}

function prev() {
  go(page.value - 1)
}

function next() {
  go(page.value + 1)
}

function stopAutoplay() {
  if (timer !== null) {
    clearInterval(timer)
    timer = null
  }
}

function startAutoplay() {
  stopAutoplay()
  if (!props.autoplay || props.value.length <= props.numVisible) return
  timer = setInterval(() => {
    if (!props.circular && page.value >= maxPage.value) {
      go(0)
      return
    }
    next()
  }, Math.max(400, props.interval))
}

watch(
  () => [props.autoplay, props.interval, props.value.length, props.numVisible] as const,
  () => startAutoplay(),
  { immediate: true },
)

onBeforeUnmount(stopAutoplay)
</script>

<template>
  <div class="wi-carousel">
    <button
      v-if="showArrows"
      type="button"
      class="wi-carousel__nav wi-carousel__nav--prev"
      :aria-label="locale.prev"
      :disabled="!circular && page <= 0"
      @click="prev"
    >
      ‹
    </button>
    <div class="wi-carousel__main">
      <div class="wi-carousel__viewport">
        <div
          v-for="entry in visibleItems"
          :key="entry.index"
          class="wi-carousel__item"
          :style="{ flex: `0 0 ${100 / numVisible}%` }"
        >
          <slot name="item" :item="entry.item" :index="entry.index">
            {{ entry.item }}
          </slot>
        </div>
      </div>
      <div v-if="showIndicators && pages.length > 1" class="wi-carousel__indicators">
        <button
          v-for="index in pages"
          :key="index"
          type="button"
          class="wi-carousel__indicator"
          :class="{ 'wi-carousel__indicator--active': index === page }"
          :aria-label="String(index + 1)"
          :aria-current="index === page ? 'true' : undefined"
          @click="go(index)"
        />
      </div>
    </div>
    <button
      v-if="showArrows"
      type="button"
      class="wi-carousel__nav wi-carousel__nav--next"
      :aria-label="locale.next"
      :disabled="!circular && page >= maxPage"
      @click="next"
    >
      ›
    </button>
  </div>
</template>
