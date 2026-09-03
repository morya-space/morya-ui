<script setup lang="ts">
import type { ToolbarProps } from './types'

defineProps<ToolbarProps>()
</script>

<template>
  <div class="wi-toolbar" role="toolbar" :aria-label="ariaLabel">
    <div v-if="$slots.start" class="wi-toolbar__start">
      <slot name="start" />
    </div>
    <div v-if="$slots.center" class="wi-toolbar__center">
      <slot name="center" />
    </div>
    <div v-if="$slots.end" class="wi-toolbar__end">
      <slot name="end" />
    </div>
  </div>
</template>
