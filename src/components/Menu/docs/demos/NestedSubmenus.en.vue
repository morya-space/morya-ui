<script setup lang="ts">
import { MMenu } from 'morya-ui'
import { ref } from 'vue'

const selectedKey = ref('reports')
const model = [
  {
    key: 'analytics',
    label: 'Analytics',
    icon: 'chart-bar',
    items: [
      { key: 'reports', label: 'Reports', icon: 'file-text' },
      { key: 'monitor', label: 'Monitor', icon: 'activity' },
    ],
  },
  { key: 'settings', label: 'Settings', icon: 'settings' },
]
</script>

<template>
  <div
    style="
      width: 16rem;
      padding: var(--m-space-3);
      background: var(--m-color-surface);
      border: 1px solid var(--m-color-border);
      border-radius: var(--m-radius-lg);
      box-shadow: var(--m-shadow-sm);
    "
  >
    <MMenu v-model:selected-key="selectedKey" :model="model" embedded />
  </div>
</template>
