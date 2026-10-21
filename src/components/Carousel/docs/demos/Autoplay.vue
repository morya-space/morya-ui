<script setup lang="ts">
import { MCarousel, MCarouselItem } from 'morya-ui'

const slides = ['01', '02', '03', '04']
</script>

<template>
  <MCarousel
    autoplay
    :interval="4000"
    show-arrow
    style="height: 160px"
  >
    <MCarouselItem
      v-for="slide in slides"
      :key="slide"
    >
      <div
        style="
          align-items: center;
          background: var(--m-color-surface-secondary);
          border-radius: var(--m-radius-md);
          display: flex;
          font-size: 2rem;
          height: 100%;
          justify-content: center;
        "
      >
        {{ slide }}
      </div>
    </MCarouselItem>
  </MCarousel>
</template>
