<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import type { LabelProps } from './types'

defineOptions({ inheritAttrs: false })

const props = defineProps<LabelProps>()
const attrs = useAttrs()

const forId = computed(() => props.htmlFor ?? props.for)
</script>

<template>
  <label class="wd-label" :for="forId" v-bind="attrs">
    <slot />
  </label>
</template>
