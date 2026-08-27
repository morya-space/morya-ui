<script setup lang="ts">
import type { IconFieldProps } from './types'
import { computed } from 'vue'

const props = withDefaults(defineProps<IconFieldProps>(), {
  iconPosition: 'left',
})

const rootClass = computed(() => [
  'wi-icon-field',
  props.iconPosition === 'right' ? 'wi-icon-field--right' : 'wi-icon-field--left',
])
</script>

<template>
  <div :class="rootClass">
    <span v-if="$slots.icon" class="wi-icon-field__icon" aria-hidden="true">
      <slot name="icon" />
    </span>
    <slot />
  </div>
</template>
