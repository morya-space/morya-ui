<script setup lang="ts">
import { MDatePicker } from 'morya-ui'
import { ref } from 'vue'

const a = ref('2024-06-15')
const b = ref('2024-06-15')
const c = ref('2024-06-15')
</script>

<template>
  <div style="display:flex;flex-wrap:wrap;gap:0.75rem;align-items:flex-end">
    <MDatePicker v-model="a" size="small" label="Small" />
    <MDatePicker v-model="b" label="Default" />
    <MDatePicker v-model="c" size="large" label="Large" />
  </div>
</template>
