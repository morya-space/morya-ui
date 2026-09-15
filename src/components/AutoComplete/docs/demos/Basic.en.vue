<script setup lang="ts">
import { MAutoComplete } from 'morya-ui'
import { ref } from 'vue'

const value = ref('')
const suggestions = ['Vue', 'Vite', 'Vitest', 'Vue Router']
</script>

<template>
  <MAutoComplete v-model="value" :suggestions="suggestions" dropdown placeholder="Search…" />
</template>
