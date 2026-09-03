<script setup lang="ts">
import type { GalleryImage, GalleryProps } from './types'
import { computed, nextTick, ref, watch } from 'vue'
import { useWiLocale } from '../../locale'
import { useMenuKeyboard } from '../../shared/useMenuKeyboard'
import WiIcon from '../Icon/Icon.vue'

const props = withDefaults(defineProps<GalleryProps>(), {
  activeIndex: 0,
})

const emit = defineEmits<{
  (event: 'update:activeIndex', value: number): void
}>()
const locale = useWiLocale()

function imageSrc(image: string | GalleryImage) {
  return typeof image === 'string' ? image : image.src
}

function imageAlt(image: string | GalleryImage) {
  return typeof image === 'string' ? '' : (image.alt ?? '')
}

const current = computed(() => props.images[props.activeIndex] ?? props.images[0])
const currentSrc = computed(() => (current.value ? imageSrc(current.value) : ''))
const currentAlt = computed(() => (current.value ? imageAlt(current.value) : ''))
const currentCaption = computed(() =>
  current.value && typeof current.value !== 'string' ? current.value.caption : undefined,
)

function select(index: number) {
  if (index < 0 || index >= props.images.length || index === props.activeIndex) return
  emit('update:activeIndex', index)
}

function prev() {
  select(Math.max(0, props.activeIndex - 1))
}

function next() {
  select(Math.min(props.images.length - 1, props.activeIndex + 1))
}

const thumbs = ref<HTMLElement | null>(null)

const keyboard = useMenuKeyboard({
  itemCount: () => props.images.length,
  orientation: 'both',
  wrap: false,
  onActivate: (index) => select(index),
})

function thumbTabindex(index: number): 0 | -1 {
  if (keyboard.activeIndex.value >= 0) return keyboard.tabindexFor(index)
  return index === props.activeIndex ? 0 : -1
}

watch(keyboard.activeIndex, (index) => {
  if (index < 0) return
  select(index)
  void nextTick(() => {
    const list = thumbs.value
    if (!list || !list.contains(document.activeElement)) return
    const items = list.querySelectorAll<HTMLElement>('.wi-gallery__thumb')
    items[index]?.focus({ preventScroll: true })
  })
})
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
      <figure class="wi-gallery__stage">
        <Transition name="wi-gallery-fade" mode="out-in">
          <img
            v-if="current"
            :key="activeIndex"
            class="wi-gallery__image"
            :src="currentSrc"
            :alt="currentAlt"
          >
        </Transition>
        <figcaption v-if="currentCaption" class="wi-gallery__caption">
          {{ currentCaption }}
        </figcaption>
      </figure>
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
    <ul
      ref="thumbs"
      class="wi-gallery__thumbs"
      role="listbox"
      :aria-label="locale.thumbnails"
      @keydown="keyboard.onKeydown"
    >
      <li v-for="(image, index) in images" :key="`${imageSrc(image)}-${index}`">
        <button
          type="button"
          class="wi-gallery__thumb"
          :class="{ 'wi-gallery__thumb--active': index === activeIndex }"
          role="option"
          :aria-selected="index === activeIndex"
          :tabindex="thumbTabindex(index)"
          @click="select(index)"
          @focus="keyboard.setActive(index)"
        >
          <img :src="imageSrc(image)" :alt="imageAlt(image)">
        </button>
      </li>
    </ul>
  </div>
</template>
