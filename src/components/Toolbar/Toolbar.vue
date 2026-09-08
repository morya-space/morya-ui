<script setup lang="ts">
import type { ToolbarProps } from './types'

defineProps<ToolbarProps>()
</script>

<template>
  <div class="wk-toolbar" role="toolbar" :aria-label="ariaLabel">
    <div v-if="$slots.start" class="wk-toolbar__start">
      <slot name="start" />
    </div>
    <div v-if="$slots.center" class="wk-toolbar__center">
      <slot name="center" />
    </div>
    <div v-if="$slots.end" class="wk-toolbar__end">
      <slot name="end" />
    </div>
  </div>
</template>
