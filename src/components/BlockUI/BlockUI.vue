<script setup lang="ts">
import type { BlockUIProps } from './types'
import { computed } from 'vue'

const props = withDefaults(defineProps<BlockUIProps>(), {
  blocked: false,
})

const rootClass = computed(() => [
  'wi-blockui',
  { 'wi-blockui--blocked': props.blocked },
])
</script>

<template>
  <div :class="rootClass">
    <div class="wi-blockui__content" :aria-busy="blocked || undefined">
      <slot />
    </div>
    <div
      v-if="blocked"
      class="wi-blockui__overlay"
      role="presentation"
      aria-hidden="true"
    />
  </div>
</template>
