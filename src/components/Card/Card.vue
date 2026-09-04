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
  'wd-card',
  {
    'wd-card--bordered': props.bordered,
    'wd-card--borderless': !props.bordered,
    'wd-card--hoverable': props.hoverable,
    'wd-card--small': sizeTone.value === 'small',
    'wd-card--large': sizeTone.value === 'large',
  },
])
</script>

<template>
  <section :class="rootClass" :aria-label="ariaLabel ?? title">
    <div v-if="$slots.cover" class="wd-card__cover">
      <slot name="cover" />
    </div>
    <div v-if="$slots.header || title || subtitle" class="wd-card__header">
      <slot name="header">
        <component :is="titleTag" v-if="title" class="wd-card__title">
          {{ title }}
        </component>
        <p v-if="subtitle" class="wd-card__subtitle">
          {{ subtitle }}
        </p>
      </slot>
    </div>
    <div class="wd-card__body">
      <slot />
    </div>
    <footer v-if="$slots.footer" class="wd-card__footer">
      <slot name="footer" />
    </footer>
  </section>
</template>
