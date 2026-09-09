<script setup lang="ts">
import type { BlockUIProps } from './types'
import { computed } from 'vue'

const props = withDefaults(defineProps<BlockUIProps>(), {
  blocked: false,
})

const rootClass = computed(() => [
  'm-blockui',
  { 'm-blockui--blocked': props.blocked },
])
</script>

<template>
  <div :class="rootClass">
    <div class="m-blockui__content" :aria-busy="blocked || undefined" :inert="blocked">
      <slot />
    </div>
    <Transition name="m-blockui">
      <div
        v-if="blocked"
        class="m-blockui__overlay"
        role="presentation"
        aria-hidden="true"
      />
    </Transition>
  </div>
</template>
