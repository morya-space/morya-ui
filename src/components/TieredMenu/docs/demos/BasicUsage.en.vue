<script setup lang="ts">
import { MTieredMenu } from 'morya-ui'

const model = [
  {
    label: 'File',
    items: [
      { label: 'New', command: () => window.alert('New') },
      { label: 'Export' },
    ],
  },
  { separator: true },
  { label: 'Help' },
]
</script>

<template>
  <MTieredMenu :model="model" />
</template>
