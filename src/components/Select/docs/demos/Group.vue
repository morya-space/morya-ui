<script setup lang="ts">
import { MSelect } from 'morya-ui'
import { ref } from 'vue'

const value = ref<string | number | undefined>()
type DemoOption = { label: string, value: string } | { label: string, options: Array<{ label: string, value: string }> }
const options: DemoOption[] = [
  {
    label: 'Fruit',
    options: [
      { label: 'Apple', value: 'apple' },
      { label: 'Banana', value: 'banana' },
    ],
  },
  {
    label: 'Vegetable',
    options: [
      { label: 'Carrot', value: 'carrot' },
      { label: 'Broccoli', value: 'broccoli' },
    ],
  },
  { label: 'Ungrouped', value: 'other' },
]
</script>

<template>
  <MSelect v-model="value" label="Food" :options="options" show-search placeholder="Choose food" />
</template>
