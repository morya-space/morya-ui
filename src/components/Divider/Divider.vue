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
  'wi-divider',
  `wi-divider--${resolvedLayout.value}`,
  `wi-divider--${props.type}`,
  {
    [`wi-divider--align-${props.align}`]:
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
    <span class="wi-divider__line" />
    <span v-if="hasLabel" class="wi-divider__label"><slot>{{ label }}</slot></span>
    <span v-if="hasLabel" class="wi-divider__line" />
  </div>
</template>
