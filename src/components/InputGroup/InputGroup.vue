<script setup lang="ts">
import type { InputGroupProps } from './types'

defineProps<InputGroupProps>()
</script>

<template>
  <div class="wi-inputgroup">
    <slot />
  </div>
</template>
