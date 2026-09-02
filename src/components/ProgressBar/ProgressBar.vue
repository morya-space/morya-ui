<script setup lang="ts">
import type { ProgressBarProps } from './types'
import { computed } from 'vue'
import { normalizeSeverity } from '../../shared/types'

const props = withDefaults(defineProps<ProgressBarProps>(), {
  value: 0,
  mode: 'determinate',
  type: 'line',
  showValue: true,
})

const clampedValue = computed(() => Math.min(100, Math.max(0, props.value)))
const isIndeterminate = computed(() => props.mode === 'indeterminate')
const isCircle = computed(() => props.type === 'circle')
const statusTone = computed(() => {
  if (!props.status) return undefined
  // `error` → `danger` stays local: shared normalizeSeverity must pass `error` through
  // unchanged for Toast/Message/Timeline (their styles and the Message icon map key on
  // `error`) until those consumers migrate (fix-plan T3.7).
  if (props.status === 'error') return 'danger'
  return normalizeSeverity(props.status)
})

const progressClass = computed(() => [
  'wi-progressbar',
  {
    'wi-progressbar--indeterminate': isIndeterminate.value,
    'wi-progressbar--circle': isCircle.value,
    [`wi-progressbar--${statusTone.value}`]: Boolean(statusTone.value),
    'wi-progressbar--custom': Boolean(props.color),
  },
])

const progressStyle = computed(() =>
  props.color ? { '--wi-progressbar-fill': props.color } : undefined,
)

const valueStyle = computed(() =>
  isIndeterminate.value || isCircle.value ? undefined : { width: `${clampedValue.value}%` },
)

const circleDash = computed(() => {
  const radius = 42
  const circumference = 2 * Math.PI * radius
  const offset = circumference * (1 - clampedValue.value / 100)
  return { circumference, offset }
})

const labelText = computed(() => `${Math.round(clampedValue.value)}%`)
</script>

<template>
  <div
    :class="progressClass"
    :style="progressStyle"
    role="progressbar"
    :aria-valuemin="isIndeterminate ? undefined : 0"
    :aria-valuemax="isIndeterminate ? undefined : 100"
    :aria-valuenow="isIndeterminate ? undefined : clampedValue"
  >
    <svg v-if="isCircle" class="wi-progressbar__circle" viewBox="0 0 100 100" aria-hidden="true">
      <circle class="wi-progressbar__circle-track" cx="50" cy="50" r="42" fill="none" />
      <circle
        class="wi-progressbar__circle-value"
        cx="50"
        cy="50"
        r="42"
        fill="none"
        :stroke-dasharray="circleDash.circumference"
        :stroke-dashoffset="isIndeterminate ? undefined : circleDash.offset"
      />
    </svg>
    <div v-else class="wi-progressbar__value" :style="valueStyle">
      <span v-if="showValue && !isIndeterminate" class="wi-progressbar__label">{{ labelText }}</span>
    </div>
    <span v-if="isCircle && showValue && !isIndeterminate" class="wi-progressbar__circle-label">{{ labelText }}</span>
  </div>
</template>
