<script setup lang="ts">
import { MSelect } from 'morya-ui'
import { ref } from 'vue'

const value = ref<string | undefined>()
const options = [
  { label: 'Small', value: 'sm' },
  { label: 'Large', value: 'lg' },
]
</script>

<template>
  <div style="display:flex;flex-wrap:wrap;gap:0.75rem;align-items:flex-start">
    <MSelect v-model="value" :options="options" size="small" placeholder="Small" />
    <MSelect v-model="value" :options="options" placeholder="Normal" />
    <MSelect v-model="value" :options="options" size="large" placeholder="Large" />
  </div>
</template>
