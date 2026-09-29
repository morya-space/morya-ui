<script setup lang="ts">
import { MCascadeSelect } from 'morya-ui'
import { ref } from 'vue'

const value = ref<string | number | null>(null)
const options = [
  {
    label: '华东',
    value: 'east',
    children: [
      {
        label: '浙江',
        value: 'zj',
        children: [
          { label: '杭州', value: 'hz' },
          { label: '宁波', value: 'nb' },
        ],
      },
      {
        label: '江苏',
        value: 'js',
        children: [
          { label: '南京', value: 'nj' },
          { label: '苏州', value: 'sz' },
        ],
      },
    ],
  },
  {
    label: '华南',
    value: 'south',
    children: [
      {
        label: '广东',
        value: 'gd',
        children: [
          { label: '广州', value: 'gz' },
          { label: '深圳', value: 'szn' },
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
      placeholder="选择地区"
    />
    <div>已选：{{ value ?? '无' }}</div>
  </div>
</template>
