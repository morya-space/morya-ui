<script setup lang="ts">
import type { ToolbarProps } from './types'

defineProps<ToolbarProps>()
</script>

<template>
  <div class="rd-toolbar" role="toolbar" :aria-label="ariaLabel">
    <div v-if="$slots.start" class="rd-toolbar__start">
      <slot name="start" />
    </div>
    <div v-if="$slots.center" class="rd-toolbar__center">
      <slot name="center" />
    </div>
    <div v-if="$slots.end" class="rd-toolbar__end">
      <slot name="end" />
    </div>
  </div>
</template>
