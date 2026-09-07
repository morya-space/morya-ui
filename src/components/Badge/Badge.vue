<script setup lang="ts">
import type { BadgeProps } from './types'
import { computed, useSlots } from 'vue'
import { normalizeSeverity, resolveSizeClass } from '../../shared/types'

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
  'rd-badge',
  `rd-badge--${severityTone.value}`,
  {
    'rd-badge--dot': isDot.value,
    'rd-badge--small': sizeTone.value === 'small',
    'rd-badge--large': sizeTone.value === 'large',
    'rd-badge--processing': props.processing,
  },
])

const badgeStyle = computed(() => {
  if (!hasContent.value || !props.offset) return undefined
  const [x, y] = props.offset
  return { '--rd-badge-offset-x': `${x}px`, '--rd-badge-offset-y': `${y}px` }
})
</script>

<template>
  <span v-if="hasContent" class="rd-badge-wrap">
    <slot />
    <span :class="badgeClass" :style="badgeStyle">
      <template v-if="!isDot">{{ displayValue }}</template>
    </span>
  </span>
  <span v-else :class="badgeClass">
    <template v-if="!isDot">{{ displayValue }}</template>
  </span>
</template>
