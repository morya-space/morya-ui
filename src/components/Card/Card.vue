<script setup lang="ts">
import type { CardProps } from './types'
import { computed } from 'vue'
import { resolveSizeClass } from '../../shared/types'

const props = withDefaults(defineProps<CardProps>(), {
  bordered: true,
  hoverable: false,
  headingLevel: 2,
})

const sizeTone = computed(() => resolveSizeClass(props.size))
const titleTag = computed(() => `h${props.headingLevel}` as const)

const rootClass = computed(() => [
  'wk-card',
  {
    'wk-card--bordered': props.bordered,
    'wk-card--borderless': !props.bordered,
    'wk-card--hoverable': props.hoverable,
    'wk-card--small': sizeTone.value === 'small',
    'wk-card--large': sizeTone.value === 'large',
  },
])
</script>

<template>
  <section :class="rootClass" :aria-label="ariaLabel ?? title">
    <div v-if="$slots.cover" class="wk-card__cover">
      <slot name="cover" />
    </div>
    <div v-if="$slots.header || title || subtitle" class="wk-card__header">
      <slot name="header">
        <component :is="titleTag" v-if="title" class="wk-card__title">
          {{ title }}
        </component>
        <p v-if="subtitle" class="wk-card__subtitle">
          {{ subtitle }}
        </p>
      </slot>
    </div>
    <div class="wk-card__body">
      <slot />
    </div>
    <footer v-if="$slots.footer" class="wk-card__footer">
      <slot name="footer" />
    </footer>
  </section>
</template>
