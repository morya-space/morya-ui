<script setup lang="ts">
import { MGallery } from 'morya-ui'
import { ref } from 'vue'

const activeIndex = ref(0)
const images = [
  'https://picsum.photos/seed/wd1/640/360',
  'https://picsum.photos/seed/wd2/640/360',
  'https://picsum.photos/seed/wd3/640/360',
]
</script>

<template>
  <MGallery v-model:active-index="activeIndex" :images="images" />
</template>
