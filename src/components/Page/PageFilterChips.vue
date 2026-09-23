<script setup lang="ts">
import type { PageFilterChipsProps } from './types'
import { computed, useAttrs } from 'vue'
import { useRootParts } from '../../shared/useComponentAttrs'

defineOptions({ name: 'MPageFilterChips', inheritAttrs: false })

const props = defineProps<PageFilterChipsProps>()
const attrs = useAttrs()
const { rootAttrs } = useRootParts(attrs, () => props.pt)

const rootClass = computed(() => ['m-page-filter-chips'])
</script>

<template>
  <div
    v-bind="rootAttrs"
    :class="rootClass"
    role="list"
    :aria-label="ariaLabel"
  >
    <span v-if="label" class="m-page-filter-chips__label">{{ label }}</span>
    <div class="m-page-filter-chips__items">
      <slot />
    </div>
  </div>
</template>
