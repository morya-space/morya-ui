<script setup lang="ts">
import type { GalleryProps } from './types'
import { computed } from 'vue'
import { useWiLocale } from '../../locale'
import WiIcon from '../Icon/Icon.vue'

const props = withDefaults(defineProps<GalleryProps>(), {
  activeIndex: 0,
})

const emit = defineEmits<{
  (event: 'update:activeIndex', value: number): void
}>()
const locale = useWiLocale()

const current = computed(() => props.images[props.activeIndex] ?? props.images[0] ?? '')

function select(index: number) {
  if (index < 0 || index >= props.images.length) return
  emit('update:activeIndex', index)
}

function prev() {
  select(Math.max(0, props.activeIndex - 1))
}

function next() {
  select(Math.min(props.images.length - 1, props.activeIndex + 1))
}
</script>

<template>
  <div class="wi-gallery">
    <div class="wi-gallery__main">
      <button
        type="button"
        class="wi-gallery__nav wi-gallery__nav--prev"
        :aria-label="locale.prevImage"
        :disabled="activeIndex <= 0"
        @click="prev"
      >
        <WiIcon name="chevron-left" size="sm" />
      </button>
      <img v-if="current" class="wi-gallery__image" :src="current" alt="">
      <button
        type="button"
        class="wi-gallery__nav wi-gallery__nav--next"
        :aria-label="locale.nextImage"
        :disabled="activeIndex >= images.length - 1"
        @click="next"
      >
        <WiIcon name="chevron-right" size="sm" />
      </button>
    </div>
    <ul class="wi-gallery__thumbs" role="listbox" :aria-label="locale.thumbnails">
      <li v-for="(src, index) in images" :key="`${src}-${index}`">
        <button
          type="button"
          class="wi-gallery__thumb"
          :class="{ 'wi-gallery__thumb--active': index === activeIndex }"
          role="option"
          :aria-selected="index === activeIndex"
          @click="select(index)"
        >
          <img :src="src" alt="">
        </button>
      </li>
    </ul>
  </div>
</template>
