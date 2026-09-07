<script setup lang="ts">
import type { DividerProps } from './types'
import { computed, useSlots } from 'vue'

const props = withDefaults(defineProps<DividerProps>(), {
  type: 'solid',
  align: 'center',
})

const slots = useSlots()
const resolvedLayout = computed(() => props.layout ?? 'horizontal')
const resolvedAlign = computed(() => props.titlePlacement ?? props.align)
const hasLabel = computed(() => Boolean(props.label || slots.default))

const rootClass = computed(() => [
  'rd-divider',
  `rd-divider--${resolvedLayout.value}`,
  `rd-divider--${props.type}`,
  {
    [`rd-divider--align-${resolvedAlign.value}`]:
      hasLabel.value && resolvedLayout.value === 'horizontal' && resolvedAlign.value !== 'center',
  },
])
</script>

<template>
  <div
    :class="rootClass"
    role="separator"
    :aria-orientation="resolvedLayout"
  >
    <span class="rd-divider__line" />
    <span v-if="hasLabel" class="rd-divider__label"><slot>{{ label }}</slot></span>
    <span v-if="hasLabel" class="rd-divider__line" />
  </div>
</template>
