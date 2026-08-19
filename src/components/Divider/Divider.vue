<script setup lang="ts">
import { computed, useSlots } from 'vue'
import type { DividerProps } from './types'

const props = withDefaults(defineProps<DividerProps>(), {
  type: 'solid',
  align: 'center',
})

const slots = useSlots()
const resolvedLayout = computed(() => props.layout ?? props.orientation ?? 'horizontal')
const hasLabel = computed(() => Boolean(props.label || slots.default))

const rootClass = computed(() => [
  'wd-divider',
  `wd-divider--${resolvedLayout.value}`,
  `wd-divider--${props.type}`,
  {
    [`wd-divider--align-${props.align}`]:
      hasLabel.value && resolvedLayout.value === 'horizontal' && props.align !== 'center',
  },
])
</script>

<template>
  <div
    :class="rootClass"
    :role="hasLabel ? 'separator' : undefined"
    :aria-orientation="resolvedLayout"
  >
    <span class="wd-divider__line" />
    <span v-if="hasLabel" class="wd-divider__label"><slot>{{ label }}</slot></span>
    <span v-if="hasLabel" class="wd-divider__line" />
  </div>
</template>
