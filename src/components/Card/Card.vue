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
  'rd-card',
  {
    'rd-card--bordered': props.bordered,
    'rd-card--borderless': !props.bordered,
    'rd-card--hoverable': props.hoverable,
    'rd-card--small': sizeTone.value === 'small',
    'rd-card--large': sizeTone.value === 'large',
  },
])
</script>

<template>
  <section :class="rootClass" :aria-label="ariaLabel ?? title">
    <div v-if="$slots.cover" class="rd-card__cover">
      <slot name="cover" />
    </div>
    <div v-if="$slots.header || title || subtitle" class="rd-card__header">
      <slot name="header">
        <component :is="titleTag" v-if="title" class="rd-card__title">
          {{ title }}
        </component>
        <p v-if="subtitle" class="rd-card__subtitle">
          {{ subtitle }}
        </p>
      </slot>
    </div>
    <div class="rd-card__body">
      <slot />
    </div>
    <footer v-if="$slots.footer" class="rd-card__footer">
      <slot name="footer" />
    </footer>
  </section>
</template>
