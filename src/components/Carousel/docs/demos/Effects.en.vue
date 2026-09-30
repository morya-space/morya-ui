<script setup lang="ts">
import { MCarousel, MCarouselItem } from 'morya-ui'

const slides = ['Card A', 'Card B', 'Card C', 'Card D']
</script>

<template>
  <div class="demo-stack">
    <MCarousel
      class="demo-carousel"
      effect="fade"
      show-arrow
    >
      <MCarouselItem
        v-for="slide in slides"
        :key="`fade-${slide}`"
      >
        <div class="demo-slide">
          Fade · {{ slide }}
        </div>
      </MCarouselItem>
    </MCarousel>

    <MCarousel
      class="demo-carousel demo-carousel--card"
      effect="card"
      show-arrow
    >
      <MCarouselItem
        v-for="slide in slides"
        :key="`card-${slide}`"
      >
        <div class="demo-slide demo-slide--card">
          Card · {{ slide }}
        </div>
      </MCarouselItem>
    </MCarousel>
  </div>
</template>

<style scoped>
.demo-stack {
  display: grid;
  gap: 1.5rem;
  width: 100%;
}

.demo-carousel {
  height: 140px;
  width: 100%;
}

.demo-carousel--card {
  height: 160px;
}

.demo-slide {
  align-items: center;
  background: color-mix(in srgb, var(--m-color-primary) 12%, var(--m-color-surface));
  border-radius: var(--m-radius-md);
  box-sizing: border-box;
  display: flex;
  height: 100%;
  justify-content: center;
  width: 100%;
}

.demo-slide--card {
  background: var(--m-color-surface);
  border: var(--m-border-width) solid var(--m-color-border);
  box-shadow: var(--m-shadow-md);
}
</style>
