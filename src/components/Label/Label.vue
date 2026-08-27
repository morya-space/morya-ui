<script setup lang="ts">
import type { LabelProps } from './types'
import { computed, useAttrs } from 'vue'

defineOptions({ inheritAttrs: false })

const props = defineProps<LabelProps>()
const attrs = useAttrs()

const forId = computed(() => props.htmlFor ?? props.for)
</script>

<template>
  <label class="wi-label" :for="forId" v-bind="attrs">
    <slot />
  </label>
</template>
