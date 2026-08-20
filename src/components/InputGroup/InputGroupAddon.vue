<script setup lang="ts">
import type { InputGroupAddonProps } from './types'

defineProps<InputGroupAddonProps>()
</script>

<template>
  <span class="wi-inputgroup-addon">
    <slot />
  </span>
</template>
