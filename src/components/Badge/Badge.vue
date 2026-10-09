<script setup lang="ts">
import type { BadgeProps } from './types'
import { computed, ref, useAttrs, useSlots } from 'vue'
import { resolveSizeClass } from '../../shared/types'
import { useRootParts } from '../../shared/useComponentAttrs'
import { usePauseOffscreen } from '../../shared/usePauseOffscreen'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<BadgeProps>(), {
  type: 'primary',
  processing: false,
})

const attrs = useAttrs()
const { rootAttrs } = useRootParts(attrs, () => props.pt)
const slots = useSlots()
const animRef = ref<HTMLElement | null>(null)
const { pauseAttrs } = usePauseOffscreen(animRef, () => props.processing)
const hasContent = computed(() => Boolean(slots.default))
const typeTone = computed(() => props.type ?? 'primary')
const sizeTone = computed(() => resolveSizeClass(props.size))
const isDot = computed(() => props.value == null || props.value === '')

const displayValue = computed(() => {
  if (isDot.value) return ''
  if (typeof props.value === 'number' && props.max != null && props.value > props.max) {
    return `${props.max}+`
  }
  return String(props.value)
})

const badgeClass = computed(() => [
  'm-badge',
  `m-badge--${typeTone.value}`,
  {
    'm-badge--dot': isDot.value,
    'm-badge--small': sizeTone.value === 'small',
    'm-badge--large': sizeTone.value === 'large',
    'm-badge--processing': props.processing,
  },
])

const badgeStyle = computed(() => {
  if (!hasContent.value || !props.offset) return undefined
  const [x, y] = props.offset
  return { '--m-badge-offset-x': `${x}px`, '--m-badge-offset-y': `${y}px` }
})
</script>

<template>
  <span v-if="hasContent" v-bind="rootAttrs" class="m-badge-wrap">
    <slot />
    <span ref="animRef" v-bind="pauseAttrs" :class="badgeClass" :style="badgeStyle">
      <template v-if="!isDot">{{ displayValue }}</template>
    </span>
  </span>
  <span v-else ref="animRef" v-bind="[rootAttrs, pauseAttrs]" :class="badgeClass">
    <template v-if="!isDot">{{ displayValue }}</template>
  </span>
</template>
