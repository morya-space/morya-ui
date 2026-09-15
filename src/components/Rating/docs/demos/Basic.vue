<script setup lang="ts">
import { MRating } from 'morya-ui'
import { ref } from 'vue'

const value = ref(3)
</script>

<template>
  <MRating v-model="value" />
</template>
