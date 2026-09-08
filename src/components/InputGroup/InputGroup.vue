<script setup lang="ts">
import type { InputGroupProps } from './types'

defineProps<InputGroupProps>()
</script>

<template>
  <div class="wk-inputgroup">
    <slot />
  </div>
</template>
