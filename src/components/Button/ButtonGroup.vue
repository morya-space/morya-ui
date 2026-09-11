<script setup lang="ts">

defineOptions({ inheritAttrs: false })
import type { ButtonGroupProps } from './types'
import { useRootParts } from '../../shared/useComponentAttrs'
import { computed, useAttrs } from 'vue'

const props = withDefaults(defineProps<ButtonGroupProps>(), {
  fluid: false,
})
const attrs = useAttrs()
const { rootAttrs } = useRootParts(attrs, () => props.pt)


const groupClass = computed(() => [
  'm-button-group',
  { 'm-button-group--fluid': props.fluid },
])
</script>

<template>
  <div v-bind="rootAttrs" :class="groupClass" role="group" :aria-label="ariaLabel">
    <slot />
  </div>
</template>
