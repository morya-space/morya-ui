<script setup lang="ts">
import { computed } from 'vue'
import type { BlockUIProps } from './types'

const props = withDefaults(defineProps<BlockUIProps>(), {
  blocked: false,
})

const rootClass = computed(() => [
  'wd-blockui',
  { 'wd-blockui--blocked': props.blocked },
])
</script>

<template>
  <div :class="rootClass">
    <div class="wd-blockui__content" :aria-busy="blocked || undefined">
      <slot />
    </div>
    <div
      v-if="blocked"
      class="wd-blockui__overlay"
      role="presentation"
      aria-hidden="true"
    />
  </div>
</template>
