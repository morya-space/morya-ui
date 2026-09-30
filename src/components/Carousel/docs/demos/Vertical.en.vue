<script setup lang="ts">
import { MCarousel, MCarouselItem } from 'morya-ui'

const slides = ['Top', 'Middle', 'Bottom']
</script>

<template>
  <MCarousel
    direction="vertical"
    show-arrow
    dot-placement="right"
    dot-type="line"
    style="height: 200px"
  >
    <MCarouselItem
      v-for="slide in slides"
      :key="slide"
    >
      <div
        style="
          align-items: center;
          background: color-mix(in srgb, var(--m-color-primary) 10%, var(--m-color-surface));
          border-radius: var(--m-radius-md);
          display: flex;
          height: 100%;
          justify-content: center;
        "
      >
        {{ slide }}
      </div>
    </MCarouselItem>
  </MCarousel>
</template>
