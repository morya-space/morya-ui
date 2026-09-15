<script setup lang="ts">
import type { PageContentProps } from './types'
import { computed, useAttrs } from 'vue'
import { useRootParts } from '../../shared/useComponentAttrs'

defineOptions({ name: 'MPageContent', inheritAttrs: false })

const props = withDefaults(defineProps<PageContentProps>(), {
  density: 'default',
  width: 'full',
})
const attrs = useAttrs()
const { rootAttrs } = useRootParts(attrs, () => props.pt)

const rootClass = computed(() => [
  'm-page-content',
  {
    'm-page-content--compact': props.density === 'compact',
    'm-page-content--spacious': props.density === 'spacious',
    'm-page-content--narrow': props.width === 'narrow',
  },
])
</script>

<template>
  <div v-bind="rootAttrs" :class="rootClass">
    <slot />
  </div>
</template>
