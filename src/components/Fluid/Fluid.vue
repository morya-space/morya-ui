<script setup lang="ts">
import type { FluidProps } from './types'

withDefaults(defineProps<FluidProps>(), {
  as: 'div',
})
</script>

<template>
  <component :is="as" class="rd-fluid">
    <slot />
  </component>
</template>
