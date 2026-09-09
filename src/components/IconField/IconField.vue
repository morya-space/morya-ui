<script setup lang="ts">
import type { IconFieldProps } from './types'
import { computed } from 'vue'

const props = withDefaults(defineProps<IconFieldProps>(), {
  iconPosition: 'left',
})

const rootClass = computed(() => [
  'm-icon-field',
  props.iconPosition === 'right' ? 'm-icon-field--right' : 'm-icon-field--left',
])
</script>

<template>
  <div :class="rootClass">
    <span v-if="$slots.icon" class="m-icon-field__icon" aria-hidden="true">
      <slot name="icon" />
    </span>
    <slot />
  </div>
</template>
