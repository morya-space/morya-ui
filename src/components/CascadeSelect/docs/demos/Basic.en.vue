<script setup lang="ts">
import { MCascadeSelect } from 'morya-ui'
import { ref } from 'vue'

const value = ref<string | number | null>(null)
const options = [
  {
    label: 'Electronics',
    value: 'electronics',
    children: [
      { label: 'Phone', value: 'phone' },
      { label: 'Laptop', value: 'laptop' },
    ],
  },
  { label: 'Books', value: 'books' },
]
</script>

<template>
  <MCascadeSelect v-model="value" :options="options" placeholder="Select a category" />
</template>
