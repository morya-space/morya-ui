<script setup lang="ts">
import { MTieredMenu } from 'morya-ui'

const model = [
  {
    label: '文件',
    items: [
      { label: '新建', command: () => window.alert('新建') },
      { label: '导出' },
    ],
  },
  { separator: true },
  { label: '帮助' },
]
</script>

<template>
  <MTieredMenu :model="model" />
</template>
