<script setup lang="ts">
import { MAutoComplete } from 'morya-ui'
import { ref } from 'vue'

const value = ref('')
const suggestions = [
  { label: 'Vue', value: 'vue' },
  { label: 'Vite', value: 'vite' },
]
</script>

<template>
  <MAutoComplete v-model="value" :suggestions="suggestions" clearable placeholder="Option objects…" />
</template>
