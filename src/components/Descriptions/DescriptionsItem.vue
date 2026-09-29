<script setup lang="ts">
import type { DescriptionsItemProps } from './types'
import { computed, inject, useSlots } from 'vue'
import { DESCRIPTIONS_KEY } from './types'

const props = withDefaults(defineProps<DescriptionsItemProps>(), {
  span: 1,
})

const slots = useSlots()
const ctx = inject(DESCRIPTIONS_KEY, null)

const span = computed(() => {
  const raw = Math.max(1, Math.floor(props.span) || 1)
  const max = ctx?.column.value ?? 3
  return Math.min(raw, max)
})

const itemClass = computed(() => [
  'm-descriptions__item',
  {
    'm-descriptions__item--bordered': ctx?.bordered.value,
  },
])

const itemStyle = computed(() => ({
  gridColumn: `span ${span.value}`,
}))

const showColon = computed(() => Boolean(ctx?.colon.value))
</script>

<template>
  <div
    :class="itemClass"
    :style="itemStyle"
  >
    <div class="m-descriptions__label">
      <slot name="label">
        {{ label }}
      </slot>
      <span
        v-if="showColon && (slots.label || label)"
        class="m-descriptions__colon"
        aria-hidden="true"
      >:</span>
    </div>
    <div class="m-descriptions__content">
      <slot />
    </div>
  </div>
</template>
