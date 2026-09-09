<script setup lang="ts">
import type { ToolbarProps } from './types'

defineProps<ToolbarProps>()
</script>

<template>
  <div class="m-toolbar" role="toolbar" :aria-label="ariaLabel">
    <div v-if="$slots.start" class="m-toolbar__start">
      <slot name="start" />
    </div>
    <div v-if="$slots.center" class="m-toolbar__center">
      <slot name="center" />
    </div>
    <div v-if="$slots.end" class="m-toolbar__end">
      <slot name="end" />
    </div>
  </div>
</template>
