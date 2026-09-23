<script setup lang="ts">
import { MSelect } from 'morya-ui'
import { ref } from 'vue'

const value = ref<string | number | undefined>()
const options = [
  {
    label: 'Fruit',
    items: [
      { label: 'Apple', value: 'apple' },
      { label: 'Banana', value: 'banana' },
    ],
  },
  {
    label: 'Vegetable',
    items: [
      { label: 'Carrot', value: 'carrot' },
      { label: 'Broccoli', value: 'broccoli' },
    ],
  },
  { label: 'Ungrouped', value: 'other' },
]
</script>

<template>
  <MSelect v-model="value" label="Food" :options="options" filter placeholder="Choose food" />
</template>
