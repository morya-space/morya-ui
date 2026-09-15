<script setup lang="ts">
import { MCascadeSelect } from 'morya-ui'
import { ref } from 'vue'

const value = ref<string | number | null>(null)
const options = [
  {
    label: '电子产品',
    value: 'electronics',
    children: [
      { label: '手机', value: 'phone' },
      { label: '笔记本', value: 'laptop' },
    ],
  },
  { label: '图书', value: 'books' },
]
</script>

<template>
  <MCascadeSelect v-model="value" :options="options" placeholder="选择分类" />
</template>
