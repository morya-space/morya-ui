<script setup lang="ts">
import { computed } from 'vue'
import { normalizeSeverity } from '../../shared/types'
import WdIcon from '../Icon/Icon.vue'
import type { TagProps } from './types'

const props = withDefaults(defineProps<TagProps>(), {
  severity: 'primary',
  rounded: false,
})

const severityTone = computed(() => normalizeSeverity(props.severity) ?? 'primary')
</script>

<template>
  <span
    class="wd-tag"
    :class="[`wd-tag--${severityTone}`, { 'wd-tag--rounded': rounded }]"
  >
    <WdIcon v-if="icon" class="wd-tag__icon" :name="icon" size="sm" />
    <slot>{{ value }}</slot>
  </span>
</template>
