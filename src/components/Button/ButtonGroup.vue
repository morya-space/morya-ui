<script setup lang="ts">
import type { ButtonGroupProps } from './types'
import { computed } from 'vue'

const props = withDefaults(defineProps<ButtonGroupProps>(), {
  fluid: false,
})

const groupClass = computed(() => [
  'm-button-group',
  { 'm-button-group--fluid': props.fluid },
])
</script>

<template>
  <div :class="groupClass" role="group" :aria-label="ariaLabel">
    <slot />
  </div>
</template>
