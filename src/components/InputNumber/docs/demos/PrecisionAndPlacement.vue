<script setup lang="ts">
import { MInputNumber } from 'morya-ui'
import { ref } from 'vue'

const value = ref(1.25)
</script>

<template>
  <MInputNumber v-model="value" show-buttons button-placement="right" :precision="2" :step="0.25" clearable />
</template>
