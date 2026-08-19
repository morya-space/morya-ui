<script setup lang="ts">
import { computed } from 'vue'
import { useWdLocale } from '../../locale'
import type { GalleryProps } from './types'

const props = withDefaults(defineProps<GalleryProps>(), {
  activeIndex: 0,
})

const emit = defineEmits<{
  (event: 'update:activeIndex', value: number): void
}>()
const locale = useWdLocale()

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
  <div class="wd-gallery">
    <div class="wd-gallery__main">
      <button
        type="button"
        class="wd-gallery__nav wd-gallery__nav--prev"
        :aria-label="locale.prevImage"
        :disabled="activeIndex <= 0"
        @click="prev"
      >
        ‹
      </button>
      <img v-if="current" class="wd-gallery__image" :src="current" alt="" />
      <button
        type="button"
        class="wd-gallery__nav wd-gallery__nav--next"
        :aria-label="locale.nextImage"
        :disabled="activeIndex >= images.length - 1"
        @click="next"
      >
        ›
      </button>
    </div>
    <ul class="wd-gallery__thumbs" role="listbox" :aria-label="locale.thumbnails">
      <li v-for="(src, index) in images" :key="`${src}-${index}`">
        <button
          type="button"
          class="wd-gallery__thumb"
          :class="{ 'wd-gallery__thumb--active': index === activeIndex }"
          role="option"
          :aria-selected="index === activeIndex"
          @click="select(index)"
        >
          <img :src="src" alt="" />
        </button>
      </li>
    </ul>
  </div>
</template>
