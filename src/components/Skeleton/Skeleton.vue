<script setup lang="ts">
import type { SkeletonProps } from './types'
import { computed } from 'vue'

const props = withDefaults(defineProps<SkeletonProps>(), {
  shape: 'rectangle',
  width: '100%',
  animation: 'wave',
  text: false,
  repeat: 1,
})

const count = computed(() => Math.max(1, props.repeat ?? 1))

const itemClass = computed(() => [
  'wi-skeleton',
  {
    'wi-skeleton--circle': props.shape === 'circle',
    'wi-skeleton--wave': props.animation === 'wave',
    'wi-skeleton--text': props.text,
  },
])

const itemStyle = computed(() => ({
  width: props.width,
  height: props.height ?? (props.text ? '0.85em' : undefined),
  borderRadius: props.borderRadius,
}))
</script>

<template>
  <div v-if="count > 1" class="wi-skeleton-repeat">
    <div v-for="index in count" :key="index" :class="itemClass" :style="itemStyle" aria-hidden="true" />
  </div>
  <div v-else :class="itemClass" :style="itemStyle" aria-hidden="true" />
</template>
