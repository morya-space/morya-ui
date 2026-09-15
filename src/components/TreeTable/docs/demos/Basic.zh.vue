<script setup lang="ts">
import { MTreeTable } from 'morya-ui'

const columns = [
  { field: 'name', header: '名称' },
  { field: 'size', header: '大小' },
]
const value = [
  {
    key: '0',
    data: { name: '应用', size: '100kb' },
    children: [
      { key: '0-0', data: { name: 'Vue', size: '25kb' } },
      { key: '0-1', data: { name: 'React', size: '30kb' } },
    ],
  },
]
</script>

<template>
  <MTreeTable :value="value" :columns="columns" />
</template>
