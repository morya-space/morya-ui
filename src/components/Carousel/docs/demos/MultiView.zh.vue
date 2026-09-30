<script setup lang="ts">
import { MCarousel, MCarouselItem } from 'morya-ui'

const slides = ['一', '二', '三', '四', '五', '六']
</script>

<template>
  <MCarousel
    :slides-per-view="3"
    :space-between="12"
    :loop="false"
    show-arrow
    draggable
    style="height: 120px"
  >
    <MCarouselItem
      v-for="slide in slides"
      :key="slide"
    >
      <div
        style="
          align-items: center;
          background: var(--m-color-surface-muted, #f3f4f6);
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
