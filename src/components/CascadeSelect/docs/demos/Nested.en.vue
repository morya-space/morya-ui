<script setup lang="ts">
import { MCascadeSelect } from 'morya-ui'
import { ref } from 'vue'

const value = ref<string | number | null>(null)
const options = [
  {
    label: 'East China',
    value: 'east',
    children: [
      {
        label: 'Zhejiang',
        value: 'zj',
        children: [
          { label: 'Hangzhou', value: 'hz' },
          { label: 'Ningbo', value: 'nb' },
        ],
      },
      {
        label: 'Jiangsu',
        value: 'js',
        children: [
          { label: 'Nanjing', value: 'nj' },
          { label: 'Suzhou', value: 'sz' },
        ],
      },
    ],
  },
  {
    label: 'South China',
    value: 'south',
    children: [
      {
        label: 'Guangdong',
        value: 'gd',
        children: [
          { label: 'Guangzhou', value: 'gz' },
          { label: 'Shenzhen', value: 'szn' },
        ],
      },
    ],
  },
]
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 12px; max-width: 320px">
    <MCascadeSelect
      v-model="value"
      :options="options"
      clearable
      placeholder="Select a region"
    />
    <div>Selected: {{ value ?? 'none' }}</div>
  </div>
</template>
