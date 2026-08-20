<script setup lang="ts">
import {
  computed,
  nextTick,
  onActivated,
  onBeforeUnmount,
  onMounted,
  onUpdated,
  provide,
  reactive,
  ref,
  watch,
  type CSSProperties,
  type StyleValue,
} from 'vue'
import { scrollbarContextKey } from './constants'
import Thumb from './Thumb.vue'
import type { ScrollbarDirection, ScrollbarEmits, ScrollbarProps } from './types'
import { GAP, addUnit, isNumber, isObject } from './util'

defineOptions({ name: 'WiScrollbar' })

const props = withDefaults(defineProps<ScrollbarProps>(), {
  distance: 0,
  height: '',
  maxHeight: '',
  wrapStyle: '',
  wrapClass: '',
  viewStyle: '',
  viewClass: '',
  tag: 'div',
  minSize: 20,
  tabindex: undefined,
})

const emit = defineEmits<ScrollbarEmits>()

const scrollbarRef = ref<HTMLDivElement>()
const wrapRef = ref<HTMLDivElement>()
const viewRef = ref<HTMLElement>()

const moveX = ref(0)
const moveY = ref(0)
const sizeWidth = ref('')
const sizeHeight = ref('')
const ratioX = ref(1)
const ratioY = ref(1)

const fallbackViewId = `wi-scrollbar-view-${Math.random().toString(36).slice(2, 9)}`
const contentId = computed(() => props.id ?? fallbackViewId)

let wrapScrollTop = 0
let wrapScrollLeft = 0
let direction = '' as ScrollbarDirection
let rafId = 0
let resizeObserver: ResizeObserver | undefined

const distanceScrollState: Record<ScrollbarDirection, boolean> = {
  bottom: false,
  top: false,
  right: false,
  left: false,
}

const DIRECTION_PAIRS: Record<ScrollbarDirection, ScrollbarDirection> = {
  top: 'bottom',
  bottom: 'top',
  left: 'right',
  right: 'left',
}

const resolvedWrapStyle = computed<StyleValue>(() => {
  const style: CSSProperties = {}
  const height = addUnit(props.height)
  const maxHeight = addUnit(props.maxHeight)
  if (height) style.height = height
  if (maxHeight) style.maxHeight = maxHeight
  return [props.wrapStyle, style]
})

const wrapClassList = computed(() => [
  'wi-scrollbar__wrap',
  props.wrapClass,
  { 'wi-scrollbar__wrap--hidden-default': !props.native },
])

const viewClassList = computed(() => ['wi-scrollbar__view', props.viewClass])

provide(
  scrollbarContextKey,
  reactive({
    scrollbarElement: scrollbarRef,
    wrapElement: wrapRef,
    contentId,
  }) as never,
)

function syncBarFromWrap(wrap: HTMLDivElement) {
  const offsetHeight = wrap.offsetHeight - GAP
  const offsetWidth = wrap.offsetWidth - GAP
  moveY.value = ((wrap.scrollTop * 100) / offsetHeight) * ratioY.value
  moveX.value = ((wrap.scrollLeft * 100) / offsetWidth) * ratioX.value
}

function updateBars() {
  const wrap = wrapRef.value
  if (!wrap) return

  const offsetHeight = wrap.offsetHeight - GAP
  const offsetWidth = wrap.offsetWidth - GAP

  const originalHeight = offsetHeight ** 2 / wrap.scrollHeight
  const originalWidth = offsetWidth ** 2 / wrap.scrollWidth
  const height = Math.max(originalHeight, props.minSize)
  const width = Math.max(originalWidth, props.minSize)

  ratioY.value =
    originalHeight / (offsetHeight - originalHeight) / (height / (offsetHeight - height)) || 1
  ratioX.value =
    originalWidth / (offsetWidth - originalWidth) / (width / (offsetWidth - width)) || 1

  sizeHeight.value = height + GAP < offsetHeight ? `${height}px` : ''
  sizeWidth.value = width + GAP < offsetWidth ? `${width}px` : ''
}

function isGreaterThan(a: number, b: number) {
  return a > b + Number.EPSILON
}

function shouldSkipDirection(current: ScrollbarDirection) {
  return distanceScrollState[current] ?? false
}

function updateTriggerStatus(arrivedStates: Record<string, boolean>) {
  const oppositeDirection = DIRECTION_PAIRS[direction]
  if (!oppositeDirection) return

  if (arrivedStates[direction] && !distanceScrollState[direction]) {
    distanceScrollState[direction] = true
  }
  if (!arrivedStates[oppositeDirection] && distanceScrollState[oppositeDirection]) {
    distanceScrollState[oppositeDirection] = false
  }
}

function handleScroll() {
  const wrap = wrapRef.value
  if (!wrap) return

  if (!props.native) syncBarFromWrap(wrap)

  const prevTop = wrapScrollTop
  const prevLeft = wrapScrollLeft
  wrapScrollTop = wrap.scrollTop
  wrapScrollLeft = wrap.scrollLeft

  const arrivedStates = {
    bottom: !isGreaterThan(wrap.scrollHeight - props.distance, wrap.clientHeight + wrapScrollTop),
    top: wrapScrollTop <= props.distance && prevTop !== 0,
    right:
      !isGreaterThan(wrap.scrollWidth - props.distance, wrap.clientWidth + wrapScrollLeft) &&
      prevLeft !== wrapScrollLeft,
    left: wrapScrollLeft <= props.distance && prevLeft !== 0,
  }

  emit('scroll', {
    scrollTop: wrapScrollTop,
    scrollLeft: wrapScrollLeft,
  })

  if (prevTop !== wrapScrollTop) {
    direction = wrapScrollTop > prevTop ? 'bottom' : 'top'
  }
  if (prevLeft !== wrapScrollLeft) {
    direction = wrapScrollLeft > prevLeft ? 'right' : 'left'
  }

  if (props.distance > 0) {
    if (shouldSkipDirection(direction)) return
    updateTriggerStatus(arrivedStates)
  }

  if (arrivedStates[direction]) emit('end-reached', direction)
}

function update() {
  if (props.native) return
  updateBars()
  distanceScrollState[direction] = false
  if (wrapRef.value) syncBarFromWrap(wrapRef.value)
}

function scrollTo(xCord: number, yCord?: number): void
function scrollTo(options: ScrollToOptions): void
function scrollTo(arg1: unknown, arg2?: number) {
  const wrap = wrapRef.value
  if (!wrap) return
  if (isObject(arg1)) {
    wrap.scrollTo(arg1 as ScrollToOptions)
  } else if (isNumber(arg1) && isNumber(arg2)) {
    wrap.scrollTo(arg1, arg2)
  }
}

function setScrollTop(value: number) {
  if (!isNumber(value) || !wrapRef.value) return
  wrapRef.value.scrollTop = value
}

function setScrollLeft(value: number) {
  if (!isNumber(value) || !wrapRef.value) return
  wrapRef.value.scrollLeft = value
}

function scheduleUpdate() {
  if (rafId) return
  rafId = requestAnimationFrame(() => {
    rafId = 0
    update()
  })
}

function teardownObservers() {
  resizeObserver?.disconnect()
  resizeObserver = undefined
  window.removeEventListener('resize', scheduleUpdate)
}

function setupObservers() {
  teardownObservers()
  if (props.noresize || props.native || typeof ResizeObserver === 'undefined') return

  resizeObserver = new ResizeObserver(() => scheduleUpdate())
  if (viewRef.value) resizeObserver.observe(viewRef.value)
  if (wrapRef.value) resizeObserver.observe(wrapRef.value)
  window.addEventListener('resize', scheduleUpdate)
}

watch(
  () => props.noresize,
  () => {
    if (props.noresize) teardownObservers()
    else setupObservers()
  },
)

watch(
  () => [props.maxHeight, props.height, props.native] as const,
  () => {
    if (!props.native) nextTick(() => update())
  },
)

onMounted(() => {
  nextTick(() => {
    update()
    setupObservers()
  })
})

onUpdated(() => {
  if (!props.native) scheduleUpdate()
})

onActivated(() => {
  if (!wrapRef.value) return
  wrapRef.value.scrollTop = wrapScrollTop
  wrapRef.value.scrollLeft = wrapScrollLeft
})

onBeforeUnmount(() => {
  teardownObservers()
  if (rafId) cancelAnimationFrame(rafId)
})

defineExpose({
  wrapRef,
  update,
  scrollTo,
  setScrollTop,
  setScrollLeft,
  handleScroll,
})
</script>

<template>
  <div ref="scrollbarRef" class="wi-scrollbar">
    <div
      ref="wrapRef"
      :class="wrapClassList"
      :style="resolvedWrapStyle"
      :tabindex="tabindex"
      @scroll="handleScroll"
    >
      <component
        :is="tag"
        :id="contentId"
        ref="viewRef"
        :class="viewClassList"
        :style="viewStyle"
        :role="role"
        :aria-label="ariaLabel"
        :aria-orientation="ariaOrientation"
      >
        <slot />
      </component>
    </div>

    <template v-if="!native">
      <Thumb :move="moveX" :ratio="ratioX" :size="sizeWidth" :always="always" />
      <Thumb vertical :move="moveY" :ratio="ratioY" :size="sizeHeight" :always="always" />
    </template>
  </div>
</template>
