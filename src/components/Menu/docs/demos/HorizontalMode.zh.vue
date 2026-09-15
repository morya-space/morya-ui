<script setup lang="ts">
import { MMenu } from 'morya-ui'
import { ref } from 'vue'

const selectedKey = ref('home')
const model = [
  { key: 'home', label: '首页', icon: 'home' },
  {
    key: 'products',
    label: '产品',
    icon: 'box',
    items: [
      { key: 'cloud', label: '云服务', icon: 'cloud' },
      { key: 'edge', label: '边缘计算', icon: 'server' },
    ],
  },
  { key: 'about', label: '关于', icon: 'info-circle' },
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
