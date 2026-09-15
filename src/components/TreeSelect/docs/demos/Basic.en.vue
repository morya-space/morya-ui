<script setup lang="ts">
import { MTreeSelect } from 'morya-ui'
import { ref } from 'vue'

const value = ref<string | null>(null)
const options = [
  {
    key: 'docs',
    label: 'Documents',
    children: [
      { key: 'resume', label: 'Resume' },
      { key: 'home', label: 'Home' },
    ],
  },
]
</script>

<template>
  <MTreeSelect v-model="value" :options="options" />
</template>
