<script setup lang="ts">
import type { PageSectionProps } from './types'
import { computed, useAttrs, useSlots } from 'vue'
import { useRootParts } from '../../shared/useComponentAttrs'
import MCard from '../Card/Card.vue'

defineOptions({ name: 'MPageSection', inheritAttrs: false })

const props = withDefaults(defineProps<PageSectionProps>(), {
  variant: 'default',
  headingLevel: 2,
})
const attrs = useAttrs()
const { rootAttrs } = useRootParts(attrs, () => props.pt)
const slots = useSlots()

const titleTag = computed(() => `h${props.headingLevel}` as const)
const hasHeader = computed(() => Boolean(props.title || slots.actions))
const isFormSurface = computed(() => props.variant === 'form')
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
  <MCard
    v-if="isFormSurface"
    v-bind="rootAttrs"
    :class="rootClass"
    bordered
    :heading-level="headingLevel"
  >
    <template v-if="hasHeader" #header>
      <div class="m-page-section__header">
        <component :is="titleTag" v-if="title" class="m-page-section__title">
          {{ title }}
        </component>
        <span v-else />
        <div v-if="slots.actions" class="m-page-section__actions">
          <slot name="actions" />
        </div>
      </div>
    </template>
    <slot />
  </MCard>
  <section v-else v-bind="rootAttrs" :class="rootClass">
    <div v-if="hasHeader" class="m-page-section__header">
      <component :is="titleTag" v-if="title" class="m-page-section__title">
        {{ title }}
      </component>
      <span v-else />
      <div v-if="slots.actions" class="m-page-section__actions">
        <slot name="actions" />
      </div>
    </div>
    <slot />
  </section>
</template>
