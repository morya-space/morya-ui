<script setup lang="ts">
import { MMegaMenu } from 'morya-ui'

const model = [
  {
    label: '产品',
    items: [
      [{ label: '组件库', command: () => {} }, { label: '主题' }],
      [{ label: '图标' }, { label: '模板' }],
    ],
  },
  { label: '关于', command: () => window.alert('关于') },
]
</script>

<template>
  <MMegaMenu :model="model" />
</template>
