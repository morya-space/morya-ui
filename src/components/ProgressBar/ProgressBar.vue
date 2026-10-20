<script setup lang="ts">
import type { ProgressBarProps } from './types'
import { computed, useAttrs } from 'vue'
import { useRootParts } from '../../shared/useComponentAttrs'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<ProgressBarProps>(), {
  value: 0,
  mode: 'determinate',
  type: 'line',
  showValue: true,
})

const attrs = useAttrs()
const { rootAttrs } = useRootParts(attrs, () => props.pt)

const clampedValue = computed(() => Math.min(100, Math.max(0, props.value)))
const isIndeterminate = computed(() => props.mode === 'indeterminate')
const isCircle = computed(() => props.type === 'circle')
const isActive = computed(() => props.status === 'active' && !isIndeterminate.value && !isCircle.value)
const statusTone = computed(() => {
  if (!props.status || props.status === 'active' || props.status === 'normal') return undefined
  if (props.status === 'exception') return 'danger'
  return props.status
})

const progressClass = computed(() => [
  'm-progress-bar',
  {
    'm-progress-bar--indeterminate': isIndeterminate.value,
    'm-progress-bar--circle': isCircle.value,
    [`m-progress-bar--${statusTone.value}`]: Boolean(statusTone.value),
    'm-progress-bar--active': isActive.value,
    'm-progress-bar--custom': Boolean(props.color),
  },
])

const progressStyle = computed(() =>
  props.color ? { '--m-progress-bar-fill': props.color } : undefined,
)

const valueStyle = computed(() =>
  isIndeterminate.value || isCircle.value
    ? undefined
    : ({ '--m-progress-bar-scale': String(clampedValue.value / 100) } as Record<string, string>),
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
    v-bind="rootAttrs"
    :class="progressClass"
    :style="progressStyle"
    role="progressbar"
    :aria-valuemin="isIndeterminate ? undefined : 0"
    :aria-valuemax="isIndeterminate ? undefined : 100"
    :aria-valuenow="isIndeterminate ? undefined : clampedValue"
  >
    <svg v-if="isCircle" class="m-progress-bar__circle" viewBox="0 0 100 100" aria-hidden="true">
      <circle class="m-progress-bar__circle-track" cx="50" cy="50" r="42" fill="none" />
      <circle
        class="m-progress-bar__circle-value"
        cx="50"
        cy="50"
        r="42"
        fill="none"
        :stroke-dasharray="circleDash.circumference"
        :stroke-dashoffset="isIndeterminate ? undefined : circleDash.offset"
      />
    </svg>
    <div v-else class="m-progress-bar__value" :style="valueStyle">
      <div class="m-progress-bar__fill" aria-hidden="true" />
      <span v-if="showValue && !isIndeterminate" class="m-progress-bar__label">{{ labelText }}</span>
    </div>
    <span v-if="isCircle && showValue && !isIndeterminate" class="m-progress-bar__circle-label">{{ labelText }}</span>
  </div>
</template>
