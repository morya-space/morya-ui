<script setup lang="ts">
import type { IconFieldProps } from './types'
import { computed, useAttrs } from 'vue'
import { useRootParts } from '../../shared/useComponentAttrs'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<IconFieldProps>(), {
  iconPosition: 'left',
})
const attrs = useAttrs()
const { rootAttrs } = useRootParts(attrs, () => props.pt)

const rootClass = computed(() => [
  'm-icon-field',
  props.iconPosition === 'right' ? 'm-icon-field--right' : 'm-icon-field--left',
])
</script>

<template>
  <div v-bind="rootAttrs" :class="rootClass">
    <span v-if="$slots.icon" class="m-icon-field__icon" aria-hidden="true">
      <slot name="icon" />
    </span>
    <slot />
  </div>
</template>
