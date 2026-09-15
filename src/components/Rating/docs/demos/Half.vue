<script setup lang="ts">
import { MRating } from 'morya-ui'
import { ref } from 'vue'

const value = ref(2.5)
</script>

<template>
  <MRating v-model="value" allow-half />
</template>
