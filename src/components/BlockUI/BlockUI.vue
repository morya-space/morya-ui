<script setup lang="ts">
import type { BlockUIProps } from './types'
import { computed } from 'vue'

const props = withDefaults(defineProps<BlockUIProps>(), {
  blocked: false,
})

const rootClass = computed(() => [
  'wk-blockui',
  { 'wk-blockui--blocked': props.blocked },
])
</script>

<template>
  <div :class="rootClass">
    <div class="wk-blockui__content" :aria-busy="blocked || undefined" :inert="blocked">
      <slot />
    </div>
    <Transition name="wk-blockui">
      <div
        v-if="blocked"
        class="wk-blockui__overlay"
        role="presentation"
        aria-hidden="true"
      />
    </Transition>
  </div>
</template>
