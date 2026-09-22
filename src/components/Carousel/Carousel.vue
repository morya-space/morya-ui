<script setup lang="ts">

import type { CarouselProps } from './types'
import { computed, nextTick, onBeforeUnmount, ref, useAttrs, watch } from 'vue'
import { useMLocale } from '../../locale'
import { useRootParts } from '../../shared/useComponentAttrs'
import MIcon from '../Icon/Icon.vue'
defineOptions({ inheritAttrs: false })

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
const attrs = useAttrs()
const { rootAttrs } = useRootParts(attrs, () => props.pt)


const innerPage = ref(0)
const page = computed(() => props.page ?? innerPage.value)
const locale = useMLocale()
const suppressMotion = ref(false)
let timer: ReturnType<typeof setInterval> | null = null

const itemCount = computed(() => props.value.length)
const visibleCount = computed(() => Math.max(1, props.numVisible))
const maxPage = computed(() => Math.max(0, itemCount.value - visibleCount.value))
const pages = computed(() => Array.from({ length: maxPage.value + 1 }, (_, index) => index))

const trackStyle = computed(() => {
  const count = Math.max(itemCount.value, 1)
  const visible = visibleCount.value
  return {
    '--m-carousel-page': String(page.value),
    '--m-carousel-count': String(count),
    '--m-carousel-visible': String(visible),
  }
})

function go(next: number) {
  const from = page.value
  let target = next
  let wrapped = false
  if (props.circular) {
    const span = maxPage.value + 1
    if (span <= 0) return
    if (next < 0 || next > maxPage.value) wrapped = true
    target = ((next % span) + span) % span
  } else {
    target = Math.min(maxPage.value, Math.max(0, next))
  }
  if (target === from) return

  if (wrapped) {
    suppressMotion.value = true
  }
  innerPage.value = target
  emit('update:page', target)
  if (wrapped) {
    void nextTick(() => {
      requestAnimationFrame(() => {
        suppressMotion.value = false
      })
    })
  }
}

watch(maxPage, (limit) => {
  if (innerPage.value > limit) innerPage.value = limit
})

function prev() {
  go(page.value - 1)
}

function next() {
  go(page.value + 1)
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'ArrowLeft') {
    event.preventDefault()
    prev()
  } else if (event.key === 'ArrowRight') {
    event.preventDefault()
    next()
  }
}

const SWIPE_THRESHOLD = 40
let pointerStartX: number | null = null

function onPointerDown(event: PointerEvent) {
  if (!event.isPrimary || event.pointerType === 'mouse') return
  pointerStartX = event.clientX
}

function onPointerUp(event: PointerEvent) {
  if (pointerStartX === null || !event.isPrimary) return
  const delta = event.clientX - pointerStartX
  pointerStartX = null
  if (Math.abs(delta) < SWIPE_THRESHOLD) return
  if (delta > 0) prev()
  else next()
}

function onPointerCancel() {
  pointerStartX = null
}

function indicatorLabel(index: number) {
  return locale.value.carouselPage
    .replace('{index}', String(index + 1))
    .replace('{total}', String(pages.value.length))
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
  <div
    v-bind="rootAttrs"
    class="m-carousel"
    @keydown="onKeydown"
    @mouseenter="stopAutoplay"
    @mouseleave="startAutoplay"
    @focusin="stopAutoplay"
    @focusout="startAutoplay"
  >
    <button
      v-if="showArrows"
      type="button"
      class="m-carousel__nav m-carousel__nav--prev"
      :aria-label="locale.prev"
      :disabled="!circular && page <= 0"
      @click="prev"
    >
      <MIcon name="chevron-left" size="sm" />
    </button>
    <div class="m-carousel__main">
      <div
        class="m-carousel__viewport"
        @pointerdown="onPointerDown"
        @pointerup="onPointerUp"
        @pointercancel="onPointerCancel"
      >
        <div
          class="m-carousel__track"
          :class="{ 'm-carousel__track--instant': suppressMotion }"
          :style="trackStyle"
        >
          <div
            v-for="(item, index) in value"
            :key="index"
            class="m-carousel__item"
          >
            <slot name="item" :item="item" :index="index">
              {{ item }}
            </slot>
          </div>
        </div>
      </div>
      <div v-if="showIndicators && pages.length > 1" class="m-carousel__indicators">
        <button
          v-for="index in pages"
          :key="index"
          type="button"
          class="m-carousel__indicator"
          :class="{ 'm-carousel__indicator--active': index === page }"
          :aria-label="indicatorLabel(index)"
          :aria-current="index === page ? 'true' : undefined"
          @click="go(index)"
        />
      </div>
    </div>
    <button
      v-if="showArrows"
      type="button"
      class="m-carousel__nav m-carousel__nav--next"
      :aria-label="locale.next"
      :disabled="!circular && page >= maxPage"
      @click="next"
    >
      <MIcon name="chevron-right" size="sm" />
    </button>
  </div>
</template>
