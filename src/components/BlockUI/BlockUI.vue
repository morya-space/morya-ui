<script setup lang="ts">

defineOptions({ inheritAttrs: false })
import type { BlockUIProps } from './types'
import { useRootParts } from '../../shared/useComponentAttrs'
import { computed, useAttrs } from 'vue'

const props = withDefaults(defineProps<BlockUIProps>(), {
  blocked: false,
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
