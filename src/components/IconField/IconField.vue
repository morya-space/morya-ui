<script setup lang="ts">
import type { IconFieldProps } from './types'
import { computed } from 'vue'

const props = withDefaults(defineProps<IconFieldProps>(), {
  iconPosition: 'left',
})

const rootClass = computed(() => [
  'wk-icon-field',
  props.iconPosition === 'right' ? 'wk-icon-field--right' : 'wk-icon-field--left',
])
</script>

<template>
  <div :class="rootClass">
    <span v-if="$slots.icon" class="wk-icon-field__icon" aria-hidden="true">
      <slot name="icon" />
    </span>
    <slot />
  </div>
</template>
