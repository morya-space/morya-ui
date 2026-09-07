<script setup lang="ts">
import type { IconFieldProps } from './types'
import { computed } from 'vue'

const props = withDefaults(defineProps<IconFieldProps>(), {
  iconPosition: 'left',
})

const rootClass = computed(() => [
  'rd-icon-field',
  props.iconPosition === 'right' ? 'rd-icon-field--right' : 'rd-icon-field--left',
])
</script>

<template>
  <div :class="rootClass">
    <span v-if="$slots.icon" class="rd-icon-field__icon" aria-hidden="true">
      <slot name="icon" />
    </span>
    <slot />
  </div>
</template>
