<script setup lang="ts">

import type { SkeletonProps } from './types'
import { computed, useAttrs } from 'vue'
import { useRootParts } from '../../shared/useComponentAttrs'
defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<SkeletonProps>(), {
  shape: 'rectangle',
  width: '100%',
  animation: 'wave',
  text: false,
  repeat: 1,
})
const attrs = useAttrs()
const { rootAttrs } = useRootParts(attrs, () => props.pt)


const count = computed(() => Math.max(1, props.repeat ?? 1))

const itemClass = computed(() => [
  'm-skeleton',
  {
    'm-skeleton--circle': props.shape === 'circle',
    'm-skeleton--wave': props.animation === 'wave',
    'm-skeleton--text': props.text,
  },
])

const itemStyle = computed(() => ({
  width: props.width,
  height: props.height ?? (props.text ? '0.85em' : undefined),
  borderRadius: props.borderRadius,
}))
</script>

<template>
  <div v-if="count > 1" v-bind="rootAttrs" class="m-skeleton-repeat">
    <div v-for="index in count" :key="index" :class="itemClass" :style="itemStyle" aria-hidden="true" />
  </div>
  <div v-else v-bind="rootAttrs" :class="itemClass" :style="itemStyle" aria-hidden="true" />
</template>
