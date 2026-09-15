<script setup lang="ts">
import { MDatePicker } from 'morya-ui'
import { ref } from 'vue'

const value = ref<string | null>(null)
const shortcuts = [
  { label: 'Today', value: () => new Date() },
  { label: 'June 1', value: '2024-06-01' },
]
</script>

<template>
  <MDatePicker v-model="value" label="Shortcuts" :shortcuts="shortcuts" />
</template>
