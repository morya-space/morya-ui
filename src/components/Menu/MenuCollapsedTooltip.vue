<script setup lang="ts">
import { computed } from 'vue'
import MTooltip from '../Tooltip/Tooltip.vue'

const props = withDefaults(
  defineProps<{
    label?: string
    /** When false, render slot only (expanded menu). */
    active?: boolean
    /** Suppress while a flyout submenu is open. */
    suspended?: boolean
  }>(),
  {
    active: false,
    suspended: false,
  },
)

const enabled = computed(() => props.active && Boolean(props.label) && !props.suspended)
</script>

<template>
  <MTooltip
    v-if="enabled"
    :content="label!"
    placement="right"
    :show-delay="200"
    :hide-delay="0"
  >
    <slot />
  </MTooltip>
  <template v-else>
    <slot />
  </template>
</template>
