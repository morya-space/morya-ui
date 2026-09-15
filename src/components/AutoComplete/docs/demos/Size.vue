<script setup lang="ts">
import { MAutoComplete } from 'morya-ui'
import { ref } from 'vue'

const a = ref('')
const b = ref('')
const c = ref('')
const suggestions = ['Vue', 'Vite', 'Vitest']
</script>

<template>
  <div class="flex flex-wrap gap-3">
    <MAutoComplete v-model="a" size="small" :suggestions="suggestions" placeholder="Small" />
    <MAutoComplete v-model="b" :suggestions="suggestions" placeholder="Default" />
    <MAutoComplete v-model="c" size="large" :suggestions="suggestions" placeholder="Large" />
  </div>
</template>
