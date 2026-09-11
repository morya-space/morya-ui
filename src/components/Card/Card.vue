<script setup lang="ts">

defineOptions({ inheritAttrs: false })
import type { CardProps } from './types'
import { useRootParts } from '../../shared/useComponentAttrs'
import { computed, useAttrs } from 'vue'
import { resolveSizeClass } from '../../shared/types'

const props = withDefaults(defineProps<CardProps>(), {
  bordered: true,
  hoverable: false,
  headingLevel: 2,
})
const attrs = useAttrs()
const { rootAttrs } = useRootParts(attrs, () => props.pt)


const sizeTone = computed(() => resolveSizeClass(props.size))
const titleTag = computed(() => `h${props.headingLevel}` as const)

const rootClass = computed(() => [
  'm-card',
  {
    'm-card--bordered': props.bordered,
    'm-card--borderless': !props.bordered,
    'm-card--hoverable': props.hoverable,
    'm-card--small': sizeTone.value === 'small',
    'm-card--large': sizeTone.value === 'large',
  },
])
</script>

<template>
  <section v-bind="rootAttrs" :class="rootClass" :aria-label="ariaLabel ?? title">
    <div v-if="$slots.cover" class="m-card__cover">
      <slot name="cover" />
    </div>
    <div v-if="$slots.header || title || subtitle" class="m-card__header">
      <slot name="header">
        <component :is="titleTag" v-if="title" class="m-card__title">
          {{ title }}
        </component>
        <p v-if="subtitle" class="m-card__subtitle">
          {{ subtitle }}
        </p>
      </slot>
    </div>
    <div class="m-card__body">
      <slot />
    </div>
    <footer v-if="$slots.footer" class="m-card__footer">
      <slot name="footer" />
    </footer>
  </section>
</template>
