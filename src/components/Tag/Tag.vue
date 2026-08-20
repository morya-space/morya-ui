<script setup lang="ts">
import { computed } from 'vue'
import { normalizeSeverity } from '../../shared/types'
import WiIcon from '../Icon/Icon.vue'
import type { TagProps } from './types'

const props = withDefaults(defineProps<TagProps>(), {
  severity: 'primary',
  rounded: false,
})

const severityTone = computed(() => normalizeSeverity(props.severity) ?? 'primary')
</script>

<template>
  <span
    class="wi-tag"
    :class="[`wi-tag--${severityTone}`, { 'wi-tag--rounded': rounded }]"
  >
    <WiIcon v-if="icon" class="wi-tag__icon" :name="icon" size="sm" />
    <slot>{{ value }}</slot>
  </span>
</template>
