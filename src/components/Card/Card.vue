<script setup lang="ts">
import { computed } from 'vue'
import { resolveSizeClass } from '../../shared/types'
import type { CardProps } from './types'

const props = withDefaults(defineProps<CardProps>(), {
  bordered: true,
  hoverable: false,
})

const sizeTone = computed(() => resolveSizeClass(props.size))

const rootClass = computed(() => [
  'wi-card',
  {
    'wi-card--bordered': props.bordered,
    'wi-card--borderless': !props.bordered,
    'wi-card--hoverable': props.hoverable,
    'wi-card--small': sizeTone.value === 'small',
    'wi-card--large': sizeTone.value === 'large',
  },
])
</script>

<template>
  <section :class="rootClass" :aria-label="ariaLabel ?? title">
    <div v-if="$slots.cover" class="wi-card__cover">
      <slot name="cover" />
    </div>
    <div v-if="$slots.header || title || subtitle" class="wi-card__header">
      <slot name="header">
        <h2 v-if="title" class="wi-card__title">{{ title }}</h2>
        <p v-if="subtitle" class="wi-card__subtitle">{{ subtitle }}</p>
      </slot>
    </div>
    <div class="wi-card__body"><slot /></div>
    <footer v-if="$slots.footer" class="wi-card__footer"><slot name="footer" /></footer>
  </section>
</template>
