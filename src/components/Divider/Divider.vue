<script setup lang="ts">
import type { DividerProps } from './types'
import { computed, useAttrs, useSlots } from 'vue'
import { useRootParts } from '../../shared/useComponentAttrs'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<DividerProps>(), {
  type: 'solid',
  align: 'center',
  plain: false,
})

const attrs = useAttrs()
const { rootAttrs } = useRootParts(attrs, () => props.pt)
const slots = useSlots()
const resolvedLayout = computed(
  () => props.layout ?? props.orientation ?? 'horizontal',
)
const resolvedAlign = computed(() => props.titlePlacement ?? props.align)
const hasLabel = computed(() => Boolean(props.label || slots.default))

const rootClass = computed(() => [
  'm-divider',
  `m-divider--${resolvedLayout.value}`,
  `m-divider--${props.type}`,
  {
    'm-divider--plain': props.plain && hasLabel.value,
    'm-divider--with-label': hasLabel.value,
    [`m-divider--size-${props.size}`]:
      props.size != null && resolvedLayout.value === 'horizontal',
    [`m-divider--align-${resolvedAlign.value}`]:
      hasLabel.value &&
      resolvedLayout.value === 'horizontal' &&
      resolvedAlign.value !== 'center',
  },
])
</script>

<template>
  <div
    v-bind="rootAttrs"
    :class="rootClass"
    role="separator"
    :aria-orientation="resolvedLayout"
  >
    <span class="m-divider__line" />
    <span v-if="hasLabel" class="m-divider__label"><slot>{{ label }}</slot></span>
    <span v-if="hasLabel" class="m-divider__line" />
  </div>
</template>
