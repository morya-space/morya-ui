<script setup lang="ts">
import { MSelectButton } from 'morya-ui'
import { ref } from 'vue'

const value = ref('center')
const options = [
  { label: 'Left', value: 'left' },
  { label: 'Center', value: 'center' },
  { label: 'Right', value: 'right' },
]
</script>

<template>
  <MSelectButton v-model="value" :options="options" />
</template>
