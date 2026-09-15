<script setup lang="ts">
import { MDatePicker } from 'morya-ui'
import { ref } from 'vue'

const value = ref<string | null>(null)
const shortcuts = [
  { label: '今天', value: () => new Date() },
  { label: '六月一日', value: '2024-06-01' },
]
</script>

<template>
  <MDatePicker v-model="value" label="快捷选项" :shortcuts="shortcuts" />
</template>
