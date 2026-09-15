<script setup lang="ts">
import type { StatusProps } from './types'
import { computed } from 'vue'
import { useConfiguredSize } from '../../shared/config'
import { normalizeSeverity } from '../../shared/types'

const props = withDefaults(defineProps<StatusProps>(), {
  severity: 'secondary',
  processing: false,
})

const sizeClass = useConfiguredSize('Status', () => props.size)
const severityTone = computed(() => normalizeSeverity(props.severity) ?? 'secondary')

const rootClass = computed(() => [
  'm-status',
  `m-status--${severityTone.value}`,
  `m-status--${sizeClass.value}`,
  {
    'm-status--processing': props.processing,
    'm-status--custom': Boolean(props.color),
  },
])

const rootStyle = computed(() =>
  props.color ? { '--m-status-color': props.color } : undefined,
)
</script>

<template>
  <span :class="rootClass" :style="rootStyle" role="status">
    <span class="m-status__dot" aria-hidden="true" />
    <span class="m-status__label">
      <slot>{{ label }}</slot>
    </span>
  </span>
</template>
