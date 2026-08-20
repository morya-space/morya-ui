<script setup lang="ts">
import { computed, ref } from 'vue'
import { useWiLocale } from '../../locale'
import type { CarouselProps } from './types'

const props = withDefaults(defineProps<CarouselProps>(), {
  numVisible: 1,
  circular: false,
})

const emit = defineEmits<{
  (event: 'update:page', value: number): void
}>()

const page = ref(0)
const locale = useWiLocale()

const maxPage = computed(() => Math.max(0, props.value.length - props.numVisible))

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
</script>

<template>
  <div class="wi-carousel">
    <button
      type="button"
      class="wi-carousel__nav wi-carousel__nav--prev"
      :aria-label="locale.prev"
      :disabled="!circular && page <= 0"
      @click="prev"
    >
      ‹
    </button>
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
    <button
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
