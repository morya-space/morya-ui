<script setup lang="ts">
import type { InputGroupProps } from './types'
import { useAttrs } from 'vue'
import { useRootParts } from '../../shared/useComponentAttrs'

defineOptions({ inheritAttrs: false })

const props = defineProps<InputGroupProps>()
const attrs = useAttrs()
const { rootAttrs } = useRootParts(attrs, () => props.pt)
</script>

<template>
  <div v-bind="rootAttrs" class="m-inputgroup">
    <slot />
  </div>
</template>
