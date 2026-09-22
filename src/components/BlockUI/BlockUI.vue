<script setup lang="ts">

import type { BlockUIProps } from './types'
import { computed, useAttrs } from 'vue'
import { useRootParts } from '../../shared/useComponentAttrs'
import { useMotionTransition } from '../../theme/useMotionTransition'
defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<BlockUIProps>(), {
  blocked: false,
})
const { transitionName, transitionCss } = useMotionTransition({
  role: 'overlay',
  local: () => props.transition,
  componentName: 'BlockUI',
  fallback: 'blockui',
})
const attrs = useAttrs()
const { rootAttrs } = useRootParts(attrs, () => props.pt)


const rootClass = computed(() => [
  'm-blockui',
  { 'm-blockui--blocked': props.blocked },
])
</script>

<template>
  <div v-bind="rootAttrs" :class="rootClass">
    <div class="m-blockui__content" :aria-busy="blocked || undefined" :inert="blocked">
      <slot />
    </div>
    <Transition :name="transitionName" :css="transitionCss">
      <div
        v-if="blocked"
        class="m-blockui__overlay"
        role="presentation"
        aria-hidden="true"
      />
    </Transition>
  </div>
</template>
