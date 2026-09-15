<script setup lang="ts">
import { MCarousel } from 'morya-ui'

const value = ['春', '夏', '秋', '冬']
</script>

<template>
  <MCarousel :value="value" :num-visible="1" circular>
    <template #item="{ item }">
      <div style="padding:2rem;text-align:center;background:var(--m-color-surface-muted, #f3f4f6);border-radius:var(--m-radius-md)">
        {{ item }}
      </div>
    </template>
  </MCarousel>
</template>
