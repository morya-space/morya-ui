<script setup lang="ts">
import type { VNode } from 'vue'
import type {
  CarouselArrowSlotProps,
  CarouselDotsSlotProps,
  CarouselInstance,
  CarouselProps,
} from './types'
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  provide,
  ref,
  useAttrs,
  useSlots,
  watch,
} from 'vue'
import { useMLocale } from '../../locale'
import { useRootParts } from '../../shared/useComponentAttrs'
import { flattenVNodes } from '../../shared/vnode'
import MButton from '../Button/Button.vue'
import { CAROUSEL_KEY } from './context'

defineOptions({ name: 'MCarousel', inheritAttrs: false })

const props = withDefaults(defineProps<CarouselProps>(), {
  defaultIndex: 0,
  showArrow: false,
  showDots: true,
  dotType: 'dot',
  dotPlacement: 'bottom',
  slidesPerView: 1,
  spaceBetween: 0,
  centeredSlides: false,
  direction: 'horizontal',
  autoplay: false,
  interval: 5000,
  loop: true,
  effect: 'slide',
  trigger: 'click',
  touchable: true,
  draggable: false,
  mousewheel: false,
  keyboard: false,
  transitionDuration: 300,
})

const emit = defineEmits<{
  'update:currentIndex': [currentIndex: number, lastIndex: number]
}>()

const attrs = useAttrs()
const slots = useSlots()
const { rootAttrs } = useRootParts(attrs, () => props.pt)
const locale = useMLocale()

const rootEl = ref<HTMLElement | null>(null)
const viewportEl = ref<HTMLElement | null>(null)
const slidesEl = ref<HTMLElement | null>(null)
const translatePx = ref(0)
const suppressMotion = ref(false)
const dragging = ref(false)
const dragOffset = ref(0)
const autoplayPaused = ref(false)

const slides = computed(() => flattenVNodes(slots.default?.() as VNode[] | undefined))
const total = computed(() => slides.value.length)
const vertical = computed(() => props.direction === 'vertical')
const sequenceLayout = computed(() => props.effect === 'slide')

const perView = computed(() => {
  if (!sequenceLayout.value || props.centeredSlides) return 1
  if (props.slidesPerView === 'auto') return 1
  return Math.max(1, Number(props.slidesPerView) || 1)
})

const pageCount = computed(() => {
  if (!sequenceLayout.value || props.centeredSlides || props.slidesPerView === 'auto') {
    return Math.max(1, total.value)
  }
  return Math.max(1, total.value - perView.value + 1)
})

const innerIndex = ref(clampIndex(props.defaultIndex, pageCount.value))
const currentIndex = computed(() =>
  props.currentIndex !== undefined
    ? clampIndex(props.currentIndex, pageCount.value)
    : clampIndex(innerIndex.value, pageCount.value),
)

function clampIndex(index: number, count: number) {
  if (count <= 0) return 0
  return Math.min(count - 1, Math.max(0, index))
}

function normalizeIndex(next: number) {
  const count = pageCount.value
  if (count <= 0) return 0
  if (props.loop) return ((next % count) + count) % count
  return clampIndex(next, count)
}

function setIndex(next: number) {
  const last = currentIndex.value
  const target = normalizeIndex(next)
  if (target === last) return

  const wrapped = props.loop && Math.abs(next - last) > 1 && (next < 0 || next >= pageCount.value)
  if (wrapped && sequenceLayout.value) suppressMotion.value = true

  if (props.currentIndex === undefined) innerIndex.value = target
  emit('update:currentIndex', target, last)

  if (wrapped && sequenceLayout.value) {
    void nextTick(() => {
      requestAnimationFrame(() => {
        suppressMotion.value = false
      })
    })
  }
}

function to(index: number) {
  setIndex(index)
}

function prev() {
  setIndex(currentIndex.value - 1)
}

function next() {
  setIndex(currentIndex.value + 1)
}

function getCurrentIndex() {
  return currentIndex.value
}

function isActive(index: number) {
  return index === currentIndex.value
}

function isPrev(index: number) {
  const count = total.value
  if (count <= 0) return false
  const prevIndex = props.loop
    ? (currentIndex.value - 1 + count) % count
    : currentIndex.value - 1
  return index === prevIndex
}

function isNext(index: number) {
  const count = total.value
  if (count <= 0) return false
  const nextIndex = props.loop
    ? (currentIndex.value + 1) % count
    : currentIndex.value + 1
  return index === nextIndex
}

provide(CAROUSEL_KEY, {
  currentIndex,
  total,
  isActive,
  isPrev,
  isNext,
})

const rootClass = computed(() => [
  'm-carousel',
  `m-carousel--${props.direction}`,
  `m-carousel--${props.effect}`,
  `m-carousel--dots-${props.dotPlacement}`,
  {
    'm-carousel--show-arrow': props.showArrow,
    'm-carousel--dragging': dragging.value,
  },
])

const slidesStyle = computed(() => {
  const duration = `${Math.max(0, props.transitionDuration)}ms`
  const style: Record<string, string> = {
    '--m-carousel-duration': duration,
    '--m-carousel-gap': `${Math.max(0, props.spaceBetween)}px`,
  }
  if (sequenceLayout.value) {
    const offset = translatePx.value - dragOffset.value
    style.transform = vertical.value
      ? `translate3d(0, ${-offset}px, 0)`
      : `translate3d(${-offset}px, 0, 0)`
    if (suppressMotion.value || dragging.value) style.transitionDuration = '0ms'
  }
  return style
})

function slideClass(index: number) {
  return {
    'm-carousel__slide--current': isActive(index),
    'm-carousel__slide--prev': isPrev(index),
    'm-carousel__slide--next': isNext(index),
  }
}

function syncSlideSizes() {
  const viewport = viewportEl.value
  const track = slidesEl.value
  if (!viewport || !track || !sequenceLayout.value) return

  const slideNodes = [...track.querySelectorAll<HTMLElement>(':scope > .m-carousel__slide')]
  if (!slideNodes.length) {
    translatePx.value = 0
    return
  }

  const viewSize = vertical.value ? viewport.clientHeight : viewport.clientWidth
  const gap = Math.max(0, props.spaceBetween)

  if (props.slidesPerView !== 'auto') {
    const count = Math.max(1, Number(props.slidesPerView) || 1)
    const size = Math.max(0, (viewSize - gap * (count - 1)) / count)
    for (const node of slideNodes) {
      if (vertical.value) {
        node.style.height = `${size}px`
        node.style.width = '100%'
        node.style.flex = `0 0 ${size}px`
      }
      else {
        node.style.width = `${size}px`
        node.style.height = '100%'
        node.style.flex = `0 0 ${size}px`
      }
    }
  }
  else {
    for (const node of slideNodes) {
      node.style.flex = '0 0 auto'
      if (vertical.value) node.style.width = '100%'
      else node.style.height = '100%'
    }
  }

  const active = slideNodes[Math.min(currentIndex.value, slideNodes.length - 1)]
  if (!active) {
    translatePx.value = 0
    return
  }

  let offset = vertical.value ? active.offsetTop : active.offsetLeft
  if (props.centeredSlides) {
    const slideSize = vertical.value ? active.offsetHeight : active.offsetWidth
    offset -= (viewSize - slideSize) / 2
  }
  translatePx.value = Math.max(0, offset)
}

let resizeObserver: ResizeObserver | null = null
let timer: ReturnType<typeof setInterval> | null = null

function stopAutoplay() {
  if (timer !== null) {
    clearInterval(timer)
    timer = null
  }
}

function pauseAutoplay() {
  autoplayPaused.value = true
  stopAutoplay()
}

function resumeAutoplay() {
  autoplayPaused.value = false
  startAutoplay()
}

function startAutoplay() {
  stopAutoplay()
  if (autoplayPaused.value || !props.autoplay || pageCount.value <= 1) return
  timer = setInterval(() => {
    if (!props.loop && currentIndex.value >= pageCount.value - 1) {
      to(0)
      return
    }
    next()
  }, Math.max(400, props.interval))
}

watch(
  () => [
    props.autoplay,
    props.interval,
    pageCount.value,
    props.loop,
    props.effect,
    props.slidesPerView,
    props.spaceBetween,
    props.centeredSlides,
    props.direction,
    total.value,
    currentIndex.value,
  ] as const,
  async () => {
    await nextTick()
    syncSlideSizes()
    startAutoplay()
  },
  { immediate: true },
)

watch(
  () => props.currentIndex,
  (value) => {
    if (value === undefined) return
    innerIndex.value = clampIndex(value, pageCount.value)
  },
)

watch(pageCount, (count) => {
  if (innerIndex.value > count - 1) innerIndex.value = Math.max(0, count - 1)
})

onMounted(() => {
  if (typeof ResizeObserver !== 'undefined' && viewportEl.value) {
    resizeObserver = new ResizeObserver(() => syncSlideSizes())
    resizeObserver.observe(viewportEl.value)
  }
  syncSlideSizes()
})

onBeforeUnmount(() => {
  stopAutoplay()
  resizeObserver?.disconnect()
  resizeObserver = null
  unbindDrag()
})

/* —— gestures —— */
const SWIPE_THRESHOLD = 40
let pointerStart: number | null = null
let pointerActive = false
let dragBound = false

function axisValue(event: PointerEvent | WheelEvent) {
  if ('deltaY' in event) return vertical.value ? event.deltaY : event.deltaX || event.deltaY
  return vertical.value ? event.clientY : event.clientX
}

function onPointerDown(event: PointerEvent) {
  if (!event.isPrimary || dragging.value) return
  const allowTouch = props.touchable && event.pointerType !== 'mouse'
  const allowMouse = props.draggable && event.pointerType === 'mouse'
  if (!allowTouch && !allowMouse) return
  pointerActive = true
  pointerStart = axisValue(event)
  dragOffset.value = 0
  viewportEl.value?.setPointerCapture?.(event.pointerId)
  bindDrag()
}

function onPointerMove(event: PointerEvent) {
  if (!pointerActive || pointerStart === null) return
  const delta = axisValue(event) - pointerStart
  if (!dragging.value && Math.abs(delta) < 4) return
  dragging.value = true
  if (sequenceLayout.value) dragOffset.value = delta
  event.preventDefault()
}

function onPointerUp(event: PointerEvent) {
  if (!pointerActive || pointerStart === null) return
  const delta = axisValue(event) - pointerStart
  pointerActive = false
  pointerStart = null
  const wasDragging = dragging.value
  dragging.value = false
  dragOffset.value = 0
  unbindDrag()
  if (!wasDragging && Math.abs(delta) < SWIPE_THRESHOLD) return
  if (delta > SWIPE_THRESHOLD) prev()
  else if (delta < -SWIPE_THRESHOLD) next()
  else void nextTick(() => syncSlideSizes())
}

function onPointerCancel() {
  pointerActive = false
  pointerStart = null
  dragging.value = false
  dragOffset.value = 0
  unbindDrag()
  void nextTick(() => syncSlideSizes())
}

function bindDrag() {
  if (dragBound) return
  dragBound = true
  window.addEventListener('pointermove', onPointerMove, { passive: false })
  window.addEventListener('pointerup', onPointerUp)
  window.addEventListener('pointercancel', onPointerCancel)
}

function unbindDrag() {
  if (!dragBound) return
  dragBound = false
  window.removeEventListener('pointermove', onPointerMove)
  window.removeEventListener('pointerup', onPointerUp)
  window.removeEventListener('pointercancel', onPointerCancel)
}

let wheelLocked = false
function onWheel(event: WheelEvent) {
  if (!props.mousewheel || pageCount.value <= 1) return
  const delta = axisValue(event)
  if (Math.abs(delta) < 4) return
  event.preventDefault()
  if (wheelLocked) return
  wheelLocked = true
  if (delta > 0) next()
  else prev()
  window.setTimeout(() => {
    wheelLocked = false
  }, Math.max(200, props.transitionDuration))
}

function onKeydown(event: KeyboardEvent) {
  if (!props.keyboard) return
  if (vertical.value) {
    if (event.key === 'ArrowUp') {
      event.preventDefault()
      prev()
    }
    else if (event.key === 'ArrowDown') {
      event.preventDefault()
      next()
    }
  }
  else if (event.key === 'ArrowLeft') {
    event.preventDefault()
    prev()
  }
  else if (event.key === 'ArrowRight') {
    event.preventDefault()
    next()
  }
}

function indicatorLabel(index: number) {
  return locale.value.carouselPage
    .replace('{index}', String(index + 1))
    .replace('{total}', String(pageCount.value))
}

function onDotEnter(index: number) {
  if (props.trigger === 'hover') to(index)
}

function onDotActivate(index: number) {
  if (props.trigger === 'click') to(index)
}

const arrowSlotProps = computed((): CarouselArrowSlotProps => ({
  prev,
  next,
  total: pageCount.value,
  currentIndex: currentIndex.value,
}))

const dotsSlotProps = computed((): CarouselDotsSlotProps => ({
  total: pageCount.value,
  currentIndex: currentIndex.value,
  to,
}))

const prevDisabled = computed(() => !props.loop && currentIndex.value <= 0)
const nextDisabled = computed(() => !props.loop && currentIndex.value >= pageCount.value - 1)

defineExpose({
  prev,
  next,
  to,
  getCurrentIndex,
} satisfies CarouselInstance)
</script>

<template>
  <div
    ref="rootEl"
    v-bind="rootAttrs"
    :class="rootClass"
    tabindex="0"
    @keydown="onKeydown"
    @mouseenter="pauseAutoplay"
    @mouseleave="resumeAutoplay"
    @focusin="pauseAutoplay"
    @focusout="resumeAutoplay"
  >
    <div
      ref="viewportEl"
      class="m-carousel__viewport"
      @pointerdown="onPointerDown"
      @pointerup="onPointerUp"
      @pointercancel="onPointerCancel"
      @wheel="onWheel"
    >
      <div
        ref="slidesEl"
        class="m-carousel__slides"
        :class="{ 'm-carousel__slides--instant': suppressMotion || dragging }"
        :style="slidesStyle"
      >
        <div
          v-for="(slide, index) in slides"
          :key="index"
          class="m-carousel__slide"
          :class="slideClass(index)"
        >
          <component :is="slide" />
        </div>
      </div>
    </div>

    <div
      v-if="showArrow && pageCount > 1"
      class="m-carousel__arrows"
    >
      <slot
        name="arrow"
        v-bind="arrowSlotProps"
      >
        <MButton class="m-carousel__arrow m-carousel__arrow--prev" icon="chevron-left" icon-only shape="circle" size="small" :aria-label="locale.prev" :disabled="prevDisabled" @click="prev"/>
        <MButton class="m-carousel__arrow m-carousel__arrow--next" icon="chevron-right" icon-only shape="circle" size="small" :aria-label="locale.next" :disabled="nextDisabled" @click="next"/>
      </slot>
    </div>

    <div
      v-if="showDots && pageCount > 1"
      class="m-carousel__dots"
      :class="`m-carousel__dots--${dotType}`"
      role="tablist"
    >
      <slot
        name="dots"
        v-bind="dotsSlotProps"
      >
        <button
          v-for="index in pageCount"
          :key="index - 1"
          type="button"
          class="m-carousel__dot"
          :class="{ 'm-carousel__dot--active': index - 1 === currentIndex }"
          role="tab"
          :aria-label="indicatorLabel(index - 1)"
          :aria-selected="index - 1 === currentIndex ? 'true' : 'false'"
          @click="onDotActivate(index - 1)"
          @mouseenter="onDotEnter(index - 1)"
        />
      </slot>
    </div>
  </div>
</template>
