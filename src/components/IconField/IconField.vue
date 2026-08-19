<script setup lang="ts">
import { computed } from 'vue'
import type { IconFieldProps } from './types'

const props = withDefaults(defineProps<IconFieldProps>(), {
  iconPosition: 'left',
})

const rootClass = computed(() => [
  'wd-icon-field',
  props.iconPosition === 'right' ? 'wd-icon-field--right' : 'wd-icon-field--left',
])
</script>

<template>
  <div :class="rootClass">
    <span v-if="$slots.icon" class="wd-icon-field__icon" aria-hidden="true">
      <slot name="icon" />
    </span>
    <slot />
  </div>
</template>
