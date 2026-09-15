<script setup lang="ts">
import { MMenu } from 'morya-ui'
import { ref } from 'vue'

const selectedKey = ref('home')
const model = [
  { key: 'home', label: 'Home', icon: 'home' },
  {
    key: 'products',
    label: 'Products',
    icon: 'box',
    items: [
      { key: 'cloud', label: 'Cloud', icon: 'cloud' },
      { key: 'edge', label: 'Edge', icon: 'server' },
    ],
  },
  { key: 'about', label: 'About', icon: 'info-circle' },
]
</script>

<template>
  <div
    style="
      padding: 0 var(--m-space-2);
      background: var(--m-color-surface);
      border: 1px solid var(--m-color-border);
      border-radius: var(--m-radius-lg);
      box-shadow: var(--m-shadow-sm);
    "
  >
    <MMenu v-model:selected-key="selectedKey" :model="model" mode="horizontal" embedded />
  </div>
</template>
