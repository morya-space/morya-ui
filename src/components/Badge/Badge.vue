<script setup lang="ts">
import { computed, useSlots } from 'vue'
import { normalizeSeverity, resolveSizeClass } from '../../shared/types'
import type { BadgeProps } from './types'

const props = withDefaults(defineProps<BadgeProps>(), {
  severity: 'primary',
  processing: false,
})

const slots = useSlots()
const hasContent = computed(() => Boolean(slots.default))
const severityTone = computed(() => normalizeSeverity(props.severity) ?? 'primary')
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
  'wi-badge',
  `wi-badge--${severityTone.value}`,
  {
    'wi-badge--dot': isDot.value,
    'wi-badge--small': sizeTone.value === 'small',
    'wi-badge--large': sizeTone.value === 'large',
    'wi-badge--processing': props.processing,
  },
])

const badgeStyle = computed(() => {
  if (!hasContent.value || !props.offset) return undefined
  const [x, y] = props.offset
  return { '--wi-badge-offset-x': `${x}px`, '--wi-badge-offset-y': `${y}px` }
})
</script>

<template>
  <span v-if="hasContent" class="wi-badge-wrap">
    <slot />
    <span :class="badgeClass" :style="badgeStyle">
      <template v-if="!isDot">{{ displayValue }}</template>
    </span>
  </span>
  <span v-else :class="badgeClass">
    <template v-if="!isDot">{{ displayValue }}</template>
  </span>
</template>
