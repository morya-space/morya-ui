<script setup lang="ts">
import type { CardProps } from './types'

defineProps<CardProps>()
</script>

<template>
  <section class="wi-card" :aria-label="ariaLabel ?? title">
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
