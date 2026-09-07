<script setup lang="ts">
import type { ButtonGroupProps } from './types'
import { computed } from 'vue'

const props = withDefaults(defineProps<ButtonGroupProps>(), {
  fluid: false,
})

const groupClass = computed(() => [
  'rd-button-group',
  { 'rd-button-group--fluid': props.fluid },
])
</script>

<template>
  <div :class="groupClass" role="group" :aria-label="ariaLabel">
    <slot />
  </div>
</template>
