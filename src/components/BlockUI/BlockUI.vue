<script setup lang="ts">
import type { BlockUIProps } from './types'
import { computed } from 'vue'

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
    <div class="wd-blockui__content" :aria-busy="blocked || undefined" :inert="blocked">
      <slot />
    </div>
    <Transition name="wd-blockui">
      <div
        v-if="blocked"
        class="wd-blockui__overlay"
        role="presentation"
        aria-hidden="true"
      />
    </Transition>
  </div>
</template>
