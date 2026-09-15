<script setup lang="ts">
import { MCarousel } from 'morya-ui'

const value = ['A', 'B', 'C']
</script>

<template>
  <MCarousel :value="value" autoplay :interval="4000" :show-arrows="false">
    <template #item="{ item }">
      <div style="padding:1.5rem;text-align:center;background:var(--m-color-surface-muted, #f3f4f6);border-radius:var(--m-radius-md)">
        {{ item }}
      </div>
    </template>
  </MCarousel>
</template>
