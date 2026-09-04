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
  'wd-divider',
  `wd-divider--${resolvedLayout.value}`,
  `wd-divider--${props.type}`,
  {
    [`wd-divider--align-${resolvedAlign.value}`]:
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
    <span class="wd-divider__line" />
    <span v-if="hasLabel" class="wd-divider__label"><slot>{{ label }}</slot></span>
    <span v-if="hasLabel" class="wd-divider__line" />
  </div>
</template>
