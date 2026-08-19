<script setup lang="ts">
import { computed } from 'vue'
import { useWdLocale } from '../../locale'
import type { ProgressSpinnerProps } from './types'

const props = withDefaults(defineProps<ProgressSpinnerProps>(), {
  strokeWidth: '2',
  animationDuration: '1s',
})

const locale = useWdLocale()
const label = computed(() => props.ariaLabel ?? locale.value.loading)

const spinnerStyle = computed(() => ({
  animationDuration: props.animationDuration,
}))
</script>

<template>
  <svg
    class="wd-progress-spinner"
    viewBox="0 0 50 50"
    role="status"
    :aria-label="label"
    :style="spinnerStyle"
  >
    <circle
      class="wd-progress-spinner__circle"
      cx="25"
      cy="25"
      r="20"
      fill="none"
      :stroke-width="strokeWidth"
    />
  </svg>
</template>
