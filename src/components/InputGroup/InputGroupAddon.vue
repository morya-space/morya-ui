<script setup lang="ts">
import type { InputGroupAddonProps } from './types'

defineProps<InputGroupAddonProps>()
</script>

<template>
  <span class="wd-inputgroup-addon">
    <slot />
  </span>
</template>
