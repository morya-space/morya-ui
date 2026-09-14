<script setup lang="ts">
import { useRootParts } from '../../shared/useComponentAttrs'
import type { PageSectionProps } from './types'
import { computed, useAttrs } from 'vue'

defineOptions({ name: 'MPageSection', inheritAttrs: false })

const props = withDefaults(defineProps<PageSectionProps>(), {
  variant: 'default',
  headingLevel: 2,
})
const attrs = useAttrs()
const { rootAttrs } = useRootParts(attrs, () => props.pt)

const titleTag = computed(() => `h${props.headingLevel}` as const)
const rootClass = computed(() => [
  'm-page-section',
  {
    'm-page-section--muted': props.variant === 'muted',
    'm-page-section--form': props.variant === 'form',
    'm-page-section--actions': props.variant === 'actions',
  },
])
</script>

<template>
  <section v-bind="rootAttrs" :class="rootClass">
    <component :is="titleTag" v-if="title" class="m-page-section__title">
      {{ title }}
    </component>
    <slot />
  </section>
</template>
