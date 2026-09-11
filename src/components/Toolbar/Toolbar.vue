<script setup lang="ts">

defineOptions({ inheritAttrs: false })
import type { ToolbarProps } from './types'
import { useAttrs } from 'vue'
import { useRootParts } from '../../shared/useComponentAttrs'

const props = defineProps<ToolbarProps>()
const attrs = useAttrs()
const { rootAttrs } = useRootParts(attrs, () => props.pt)
</script>

<template>
  <div v-bind="rootAttrs" class="m-toolbar" role="toolbar" :aria-label="ariaLabel">
    <div v-if="$slots.start" class="m-toolbar__start">
      <slot name="start" />
    </div>
    <div v-if="$slots.center" class="m-toolbar__center">
      <slot name="center" />
    </div>
    <div v-if="$slots.end" class="m-toolbar__end">
      <slot name="end" />
    </div>
  </div>
</template>
