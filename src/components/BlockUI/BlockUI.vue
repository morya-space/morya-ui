<script setup lang="ts">
import type { BlockUIProps } from './types'
import { computed } from 'vue'

const props = withDefaults(defineProps<BlockUIProps>(), {
  blocked: false,
})

const rootClass = computed(() => [
  'rd-blockui',
  { 'rd-blockui--blocked': props.blocked },
])
</script>

<template>
  <div :class="rootClass">
    <div class="rd-blockui__content" :aria-busy="blocked || undefined" :inert="blocked">
      <slot />
    </div>
    <Transition name="rd-blockui">
      <div
        v-if="blocked"
        class="rd-blockui__overlay"
        role="presentation"
        aria-hidden="true"
      />
    </Transition>
  </div>
</template>
