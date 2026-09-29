<script setup lang="ts">
import type { ImagePreviewGroupProps } from './types'
import { computed, onBeforeUnmount, provide, ref, useAttrs, watch } from 'vue'
import { useMLocale } from '../../locale'
import { useRootParts } from '../../shared/useComponentAttrs'
import MIcon from '../Icon/Icon.vue'
import { IMAGE_PREVIEW_GROUP_KEY } from './types'

defineOptions({ inheritAttrs: false })

const props = defineProps<ImagePreviewGroupProps>()
const attrs = useAttrs()
const { rootAttrs } = useRootParts(attrs, () => props.pt)
const locale = useMLocale()

let nextId = 0
const entries = ref<Array<{ id: number; src: string }>>([])
const previewOpen = ref(false)
const activeIndex = ref(0)

const images = computed(() => entries.value.map((e) => e.src))

function register(src: string): number {
  const id = nextId++
  entries.value = [...entries.value, { id, src }]
  return id
}

function unregister(id: number) {
  entries.value = entries.value.filter((e) => e.id !== id)
}

function openAt(id: number) {
  const index = entries.value.findIndex((e) => e.id === id)
  if (index < 0) return
  activeIndex.value = index
  previewOpen.value = true
}

function close() {
  previewOpen.value = false
}

function prev() {
  if (images.value.length === 0) return
  activeIndex.value = (activeIndex.value - 1 + images.value.length) % images.value.length
}

function next() {
  if (images.value.length === 0) return
  activeIndex.value = (activeIndex.value + 1) % images.value.length
}

function onKeydown(event: KeyboardEvent) {
  if (!previewOpen.value) return
  if (event.key === 'Escape') close()
  if (event.key === 'ArrowLeft') prev()
  if (event.key === 'ArrowRight') next()
}

watch(previewOpen, (open) => {
  if (open) document.addEventListener('keydown', onKeydown)
  else document.removeEventListener('keydown', onKeydown)
})
onBeforeUnmount(() => document.removeEventListener('keydown', onKeydown))

provide(IMAGE_PREVIEW_GROUP_KEY, {
  register,
  unregister,
  openAt,
  previewOpen,
  activeIndex,
  images,
})
</script>

<template>
  <div
    v-bind="rootAttrs"
    class="m-image-group"
  >
    <slot />
    <Teleport to="body">
      <div
        v-if="previewOpen && images.length"
        class="m-image-preview"
        role="dialog"
        aria-modal="true"
        :aria-label="locale.previewFile"
        @click.self="close"
      >
        <button
          type="button"
          class="m-image-preview__close"
          :aria-label="locale.close"
          @click="close"
        >
          <MIcon
            name="close"
            size="md"
          />
        </button>
        <button
          v-if="images.length > 1"
          type="button"
          class="m-image-preview__nav m-image-preview__nav--prev"
          :aria-label="locale.prevImage"
          @click="prev"
        >
          <MIcon
            name="chevron-left"
            size="md"
          />
        </button>
        <img
          class="m-image-preview__img"
          :src="images[activeIndex]"
          alt=""
        >
        <button
          v-if="images.length > 1"
          type="button"
          class="m-image-preview__nav m-image-preview__nav--next"
          :aria-label="locale.nextImage"
          @click="next"
        >
          <MIcon
            name="chevron-right"
            size="md"
          />
        </button>
      </div>
    </Teleport>
  </div>
</template>
