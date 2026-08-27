<script setup lang="ts">
import type { ScrollTopProps } from './types'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useWiLocale } from '../../locale'
import { useWiConfig } from '../../shared/config'
import { isOverlayTeleported, resolveOverlayTeleport } from '../../shared/overlay'

const props = withDefaults(defineProps<ScrollTopProps>(), {
  threshold: 400,
  target: 'window',
  teleport: true,
})

const config = useWiConfig()
const locale = useWiLocale()
const anchor = ref<HTMLElement | null>(null)
const root = ref<HTMLElement | null>(null)
const visible = ref(false)
const teleportTarget = computed(() => resolveOverlayTeleport(props, config.value.appendTo))
const teleported = computed(() => isOverlayTeleported(props, config.value.appendTo))

function toCssSize(value?: string | number) {
  if (value == null) return undefined
  return typeof value === 'number' ? `${value}px` : value
}

const rootClass = computed(() => [
  'wi-scrolltop',
  {
    'wi-scrolltop--visible': visible.value,
    'wi-scrolltop--parent': props.target === 'parent',
    'wi-scrolltop--teleported': teleported.value,
  },
])

const rootStyle = computed(() => {
  const style: Record<string, string> = {}
  const right = toCssSize(props.right)
  const bottom = toCssSize(props.bottom)
  if (right) style.right = right
  if (bottom) style.bottom = bottom
  return style
})

function getScrollParent(): HTMLElement | Window {
  if (props.target === 'window') return window
  const parent = anchor.value?.parentElement
  return parent ?? window
}

function getScrollTop(): number {
  const el = getScrollParent()
  if (el === window) return window.scrollY || document.documentElement.scrollTop
  return (el as HTMLElement).scrollTop
}

function updateVisibility() {
  visible.value = getScrollTop() >= props.threshold
}

function scrollToTop() {
  const el = getScrollParent()
  if (el === window) {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    return
  }
  ;(el as HTMLElement).scrollTo({ top: 0, behavior: 'smooth' })
}

function bind() {
  const el = getScrollParent()
  el.addEventListener('scroll', updateVisibility, { passive: true })
  updateVisibility()
}

function unbind() {
  const el = getScrollParent()
  el.removeEventListener('scroll', updateVisibility)
}

onMounted(() => bind())
onBeforeUnmount(() => unbind())

watch(
  () => props.target,
  () => {
    unbind()
    bind()
  },
)
</script>

<template>
  <span ref="anchor" class="wi-scrolltop-anchor" aria-hidden="true">
    <Teleport :to="teleportTarget.to" :disabled="teleportTarget.disabled">
      <button
        ref="root"
        type="button"
        :class="rootClass"
        :style="rootStyle"
        :aria-label="locale.backToTop"
        :hidden="!visible"
        @click="scrollToTop"
      >
        <slot>↑</slot>
      </button>
    </Teleport>
  </span>
</template>
