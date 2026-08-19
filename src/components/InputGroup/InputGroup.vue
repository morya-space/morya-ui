<script setup lang="ts">
import type { InputGroupProps } from './types'

defineProps<InputGroupProps>()
</script>

<template>
  <div class="wd-inputgroup">
    <slot />
  </div>
</template>
