<script setup lang="ts">
import type { ToolbarProps } from './types'

defineProps<ToolbarProps>()
</script>

<template>
  <div class="wd-toolbar" role="toolbar" :aria-label="ariaLabel">
    <div v-if="$slots.start" class="wd-toolbar__start">
      <slot name="start" />
    </div>
    <div v-if="$slots.center" class="wd-toolbar__center">
      <slot name="center" />
    </div>
    <div v-if="$slots.end" class="wd-toolbar__end">
      <slot name="end" />
    </div>
  </div>
</template>
