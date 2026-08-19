<script setup lang="ts">
import { computed } from 'vue'
import { normalizeSeverity, resolveSizeClass } from '../../shared/types'
import type { BadgeProps } from './types'

const props = withDefaults(defineProps<BadgeProps>(), {
  severity: 'primary',
})

const severityTone = computed(() => normalizeSeverity(props.severity) ?? 'primary')
const sizeTone = computed(() => resolveSizeClass(props.size))
const isDot = computed(() => props.value == null || props.value === '')

const rootClass = computed(() => [
  'wd-badge',
  `wd-badge--${severityTone.value}`,
  {
    'wd-badge--dot': isDot.value,
    'wd-badge--small': sizeTone.value === 'small',
    'wd-badge--large': sizeTone.value === 'large',
  },
])
</script>

<template>
  <span :class="rootClass">
    <template v-if="!isDot">{{ value }}</template>
  </span>
</template>
