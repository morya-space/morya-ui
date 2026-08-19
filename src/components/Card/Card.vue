<script setup lang="ts">
import type { CardProps } from './types'

defineProps<CardProps>()
</script>

<template>
  <section class="wd-card" :aria-label="ariaLabel ?? title">
    <div v-if="$slots.header || title || subtitle" class="wd-card__header">
      <slot name="header">
        <h2 v-if="title" class="wd-card__title">{{ title }}</h2>
        <p v-if="subtitle" class="wd-card__subtitle">{{ subtitle }}</p>
      </slot>
    </div>
    <div class="wd-card__body"><slot /></div>
    <footer v-if="$slots.footer" class="wd-card__footer"><slot name="footer" /></footer>
  </section>
</template>
