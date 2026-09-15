<script setup lang="ts">
import { MSelect } from 'morya-ui'
import { ref } from 'vue'

const value = ref<string | number | undefined>('design')
const options = [
  { label: 'Design', value: 'design' },
  { label: 'Development', value: 'dev' },
]
</script>

<template>
  <MSelect v-model="value" label="Team" :options="options" show-clear />
</template>
