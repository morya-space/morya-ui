<script setup lang="ts">
import type { FluidProps } from './types'

withDefaults(defineProps<FluidProps>(), {
  as: 'div',
})
</script>

<template>
  <component :is="as" class="wd-fluid">
    <slot />
  </component>
</template>
