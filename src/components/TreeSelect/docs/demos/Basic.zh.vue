<script setup lang="ts">
import { MTreeSelect } from 'morya-ui'
import { ref } from 'vue'

const value = ref<string | null>(null)
const options = [
  {
    key: 'docs',
    label: '文档',
    children: [
      { key: 'resume', label: '简历' },
      { key: 'home', label: '家居' },
    ],
  },
]
</script>

<template>
  <MTreeSelect v-model="value" :options="options" />
</template>
