<script setup lang="ts">
import { MCarousel, MCarouselItem } from 'morya-ui'

const slides = [
  { title: 'Spring', color: 'color-mix(in srgb, var(--m-color-success) 18%, var(--m-color-surface))' },
  { title: 'Summer', color: 'color-mix(in srgb, var(--m-color-warning) 18%, var(--m-color-surface))' },
  { title: 'Autumn', color: 'color-mix(in srgb, var(--m-color-danger) 16%, var(--m-color-surface))' },
  { title: 'Winter', color: 'color-mix(in srgb, var(--m-color-info) 18%, var(--m-color-surface))' },
]
</script>

<template>
  <MCarousel show-arrow style="height: 180px">
    <MCarouselItem
      v-for="slide in slides"
      :key="slide.title"
    >
      <div
        style="
          align-items: center;
          display: flex;
          font-size: 1.5rem;
          height: 100%;
          justify-content: center;
          border-radius: var(--m-radius-md);
        "
        :style="{ background: slide.color }"
      >
        {{ slide.title }}
      </div>
    </MCarouselItem>
  </MCarousel>
</template>
