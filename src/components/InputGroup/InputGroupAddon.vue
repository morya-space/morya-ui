<script setup lang="ts">
import type { InputGroupAddonProps } from './types'

defineProps<InputGroupAddonProps>()
</script>

<template>
  <span class="rd-inputgroup-addon">
    <slot />
  </span>
</template>
