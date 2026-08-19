<script setup lang="ts">
import { computed } from 'vue'
import type { ProgressBarProps } from './types'

const props = withDefaults(defineProps<ProgressBarProps>(), {
  value: 0,
  mode: 'determinate',
  showValue: true,
})

const clampedValue = computed(() => Math.min(100, Math.max(0, props.value)))

const isIndeterminate = computed(() => props.mode === 'indeterminate')

const progressClass = computed(() => [
  'wd-progressbar',
  {
    'wd-progressbar--indeterminate': isIndeterminate.value,
  },
])

const valueStyle = computed(() =>
  isIndeterminate.value ? undefined : { width: `${clampedValue.value}%` },
)

const labelText = computed(() => `${Math.round(clampedValue.value)}%`)
</script>

<template>
  <div
    :class="progressClass"
    role="progressbar"
    :aria-valuemin="isIndeterminate ? undefined : 0"
    :aria-valuemax="isIndeterminate ? undefined : 100"
    :aria-valuenow="isIndeterminate ? undefined : clampedValue"
  >
    <div class="wd-progressbar__value" :style="valueStyle">
      <span v-if="showValue && !isIndeterminate" class="wd-progressbar__label">{{ labelText }}</span>
    </div>
  </div>
</template>
