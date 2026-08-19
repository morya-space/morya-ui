<script setup lang="ts">
import type { FloatLabelProps } from './types'

defineProps<FloatLabelProps>()
</script>

<template>
  <span class="wd-float-label">
    <slot />
    <label v-if="label || $slots.label">
      <slot name="label">{{ label }}</slot>
    </label>
  </span>
</template>
