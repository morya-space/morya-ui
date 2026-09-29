<script setup lang="ts">
import type { AffixProps } from './types'
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  useAttrs,
  watch,
} from 'vue'
import { useRootParts } from '../../shared/useComponentAttrs'
import {
  getFixedBottom,
  getFixedTop,
  getTargetRect,
  throttleByAnimationFrame,
} from './affixUtils'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<AffixProps>(), {
  disabled: false,
})

const emit = defineEmits<{ change: [affixed: boolean] }>()
const attrs = useAttrs()
const { rootAttrs } = useRootParts(attrs, () => props.pt)

const AFFIX_STATUS_NONE = 0
const AFFIX_STATUS_PREPARE = 1

const placeholderRef = ref<HTMLElement | null>(null)
const fixedRef = ref<HTMLElement | null>(null)
const affixStyle = ref<Record<string, string> | undefined>()
const placeholderStyle = ref<Record<string, string> | undefined>()
const affixed = ref(false)
const statusRef = ref(AFFIX_STATUS_NONE)

let resizeObserver: ResizeObserver | null = null

const internalOffsetTop = computed(() => {
  if (props.offsetBottom === undefined && props.offsetTop === undefined) return 0
  return props.offsetTop
})

function getTarget() {
  return props.target?.() ?? window
}

function measure() {
  if (
    props.disabled
    || statusRef.value !== AFFIX_STATUS_PREPARE
    || !fixedRef.value
    || !placeholderRef.value
  ) {
    return
  }

  const targetNode = getTarget()
  if (!targetNode) return

  const placeholderRect = getTargetRect(placeholderRef.value)
  if (
    placeholderRect.top === 0
    && placeholderRect.left === 0
    && placeholderRect.width === 0
    && placeholderRect.height === 0
  ) {
    return
  }

  const targetRect = getTargetRect(targetNode)
  const fixedTop = getFixedTop(placeholderRect, targetRect, internalOffsetTop.value)
  const fixedBottom = getFixedBottom(placeholderRect, targetRect, props.offsetBottom)

  let nextAffixStyle: Record<string, string> | undefined
  let nextPlaceholderStyle: Record<string, string> | undefined

  if (fixedTop !== undefined || fixedBottom !== undefined) {
    nextAffixStyle = {
      position: 'fixed',
      width: `${placeholderRect.width}px`,
      height: `${placeholderRect.height}px`,
    }
    if (fixedTop !== undefined) nextAffixStyle.top = `${fixedTop}px`
    else if (fixedBottom !== undefined) nextAffixStyle.bottom = `${fixedBottom}px`

    nextPlaceholderStyle = {
      width: `${placeholderRect.width}px`,
      height: `${placeholderRect.height}px`,
    }
  }

  const nextAffixed = Boolean(nextAffixStyle)
  if (affixed.value !== nextAffixed) {
    affixed.value = nextAffixed
    emit('change', nextAffixed)
  }

  statusRef.value = AFFIX_STATUS_NONE
  affixStyle.value = nextAffixStyle
  placeholderStyle.value = nextPlaceholderStyle
}

function prepareMeasure() {
  statusRef.value = AFFIX_STATUS_PREPARE
  measure()
}

const updatePosition = throttleByAnimationFrame(prepareMeasure)

const lazyUpdatePosition = throttleByAnimationFrame(() => {
  if (affixStyle.value && placeholderRef.value) {
    const targetNode = getTarget()
    if (targetNode) {
      const targetRect = getTargetRect(targetNode)
      const placeholderRect = getTargetRect(placeholderRef.value)
      const fixedTop = getFixedTop(placeholderRect, targetRect, internalOffsetTop.value)
      const fixedBottom = getFixedBottom(placeholderRect, targetRect, props.offsetBottom)
      const currentTop = affixStyle.value.top
      const currentBottom = affixStyle.value.bottom
      if (
        (fixedTop !== undefined && currentTop === `${fixedTop}px`)
        || (fixedBottom !== undefined && currentBottom === `${fixedBottom}px`)
      ) {
        return
      }
    }
  }
  prepareMeasure()
})

const TRIGGER_EVENTS: (keyof WindowEventMap)[] = [
  'resize',
  'scroll',
  'touchstart',
  'touchmove',
  'touchend',
  'pageshow',
  'load',
]

let prevTarget: HTMLElement | Window | null = null
let prevListener: EventListener | null = null

function addListeners() {
  const listenerTarget = getTarget()
  if (!listenerTarget) return

  TRIGGER_EVENTS.forEach((eventName) => {
    if (prevListener) {
      prevTarget?.removeEventListener(eventName, prevListener)
    }
    listenerTarget.addEventListener(eventName, lazyUpdatePosition as EventListener, {
      passive: true,
    })
  })
  prevTarget = listenerTarget
  prevListener = lazyUpdatePosition as EventListener
}

function removeListeners() {
  const target = getTarget()
  TRIGGER_EVENTS.forEach((eventName) => {
    target?.removeEventListener(eventName, lazyUpdatePosition as EventListener)
    if (prevListener) {
      prevTarget?.removeEventListener(eventName, prevListener)
    }
  })
  updatePosition.cancel()
  lazyUpdatePosition.cancel()
}

function clearAffixState() {
  affixStyle.value = undefined
  placeholderStyle.value = undefined
  if (affixed.value) {
    affixed.value = false
    emit('change', false)
  }
}

function bindResizeObserver() {
  resizeObserver?.disconnect()
  if (typeof ResizeObserver === 'undefined') return
  resizeObserver = new ResizeObserver(() => updatePosition())
  if (placeholderRef.value) resizeObserver.observe(placeholderRef.value)
  if (fixedRef.value) resizeObserver.observe(fixedRef.value)
}

onMounted(() => {
  bindResizeObserver()
  window.setTimeout(addListeners, 0)
  updatePosition()
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  removeListeners()
})

watch(
  () => [props.target, props.offsetTop, props.offsetBottom, props.disabled] as const,
  async () => {
    removeListeners()
    if (props.disabled) {
      clearAffixState()
      return
    }
    await nextTick()
    addListeners()
    updatePosition()
  },
)

const rootClass = computed(() => [
  'm-affix',
  {
    'm-affix--affixed': affixed.value && !props.disabled,
    'm-affix--disabled': props.disabled,
  },
])

const fixedClass = computed(() => [
  'm-affix__fixed',
  { 'm-affix__fixed--active': affixStyle.value && !props.disabled },
])
</script>

<template>
  <div
    ref="placeholderRef"
    v-bind="rootAttrs"
    :class="rootClass"
  >
    <div
      v-if="affixStyle && placeholderStyle && !disabled"
      :style="placeholderStyle"
      class="m-affix__placeholder"
      aria-hidden="true"
    />
    <div
      ref="fixedRef"
      :class="fixedClass"
      :style="disabled ? undefined : affixStyle"
    >
      <slot />
    </div>
  </div>
</template>
