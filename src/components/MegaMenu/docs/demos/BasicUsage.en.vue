<script setup lang="ts">
import { MMegaMenu } from 'morya-ui'

const model = [
  {
    label: 'Products',
    items: [
      [{ label: 'Component library', command: () => {} }, { label: 'Themes' }],
      [{ label: 'Icons' }, { label: 'Templates' }],
    ],
  },
  { label: 'About', command: () => window.alert('About') },
]
</script>

<template>
  <MMegaMenu :model="model" />
</template>
