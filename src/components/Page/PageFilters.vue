<script setup lang="ts">
import { useRootParts } from '../../shared/useComponentAttrs'
import type { PageFiltersProps } from './types'
import { useAttrs } from 'vue'

defineOptions({ name: 'MPageFilters', inheritAttrs: false })

const props = defineProps<PageFiltersProps>()
const attrs = useAttrs()
const { rootAttrs } = useRootParts(attrs, () => props.pt)
</script>

<template>
  <section
    v-bind="rootAttrs"
    class="m-page-filters"
    :aria-label="ariaLabel"
  >
    <slot />
  </section>
</template>
