<script setup lang="ts">
import { computed } from 'vue'
import type { SkeletonProps } from './types'

const props = withDefaults(defineProps<SkeletonProps>(), {
  shape: 'rectangle',
  width: '100%',
  animation: 'wave',
})

const rootClass = computed(() => [
  'wd-skeleton',
  {
    'wd-skeleton--circle': props.shape === 'circle',
    'wd-skeleton--wave': props.animation === 'wave',
  },
])

const rootStyle = computed(() => ({
  width: props.width,
  height: props.height,
  borderRadius: props.borderRadius,
}))
</script>

<template>
  <div :class="rootClass" :style="rootStyle" aria-hidden="true" />
</template>
