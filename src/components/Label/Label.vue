<script setup lang="ts">
import type { LabelProps } from './types'
import { computed, useAttrs } from 'vue'
import { useRootParts } from '../../shared/useComponentAttrs'

defineOptions({ inheritAttrs: false })

const props = defineProps<LabelProps>()
const attrs = useAttrs()
const { rootAttrs } = useRootParts(attrs, () => props.pt)

const forId = computed(() => props.htmlFor ?? props.for)
</script>

<template>
  <label v-bind="rootAttrs" class="m-label" :for="forId">
    <slot />
  </label>
</template>
