<script setup lang="ts">
import type { InputGroupAddonProps } from './types'

defineProps<InputGroupAddonProps>()
</script>

<template>
  <span class="wk-inputgroup-addon">
    <slot />
  </span>
</template>
