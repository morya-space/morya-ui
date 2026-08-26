<script setup lang="ts">
import { computed } from 'vue'
import type { ButtonGroupProps } from './types'

const props = withDefaults(defineProps<ButtonGroupProps>(), {
  fluid: false,
})

const groupClass = computed(() => [
  'wi-button-group',
  { 'wi-button-group--fluid': props.fluid },
])
</script>

<template>
  <div :class="groupClass" role="group" :aria-label="ariaLabel">
    <slot />
  </div>
</template>
