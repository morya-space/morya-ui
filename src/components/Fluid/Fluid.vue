<script setup lang="ts">

import type { FluidProps } from './types'
import { useAttrs } from 'vue'
import { useRootParts } from '../../shared/useComponentAttrs'
defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<FluidProps>(), {
  as: 'div',
})
const attrs = useAttrs()
const { rootAttrs } = useRootParts(attrs, () => props.pt)
</script>

<template>
  <component v-bind="rootAttrs" :is="as" class="m-fluid">
    <slot />
  </component>
</template>
