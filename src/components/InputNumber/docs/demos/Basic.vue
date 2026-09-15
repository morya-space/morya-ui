<script setup lang="ts">
import { MInputNumber } from 'morya-ui'
import { ref } from 'vue'

const value = ref(1)
</script>

<template>
  <MInputNumber v-model="value" label="Quantity" :min="0" :max="99" />
</template>
