<script setup lang="ts">
import type { TypographyProps } from './types'
import { computed, useAttrs } from 'vue'
import { useRootParts } from '../../shared/useComponentAttrs'

defineOptions({ inheritAttrs: false, name: 'MTypography' })

const props = defineProps<TypographyProps>()

const attrs = useAttrs()
const { rootAttrs } = useRootParts(attrs, () => props.pt)

const rootClass = computed(() => ['m-typography', 'm-typography-root'])
</script>

<template>
  <article
    v-bind="rootAttrs"
    :class="rootClass"
  >
    <slot />
  </article>
</template>
