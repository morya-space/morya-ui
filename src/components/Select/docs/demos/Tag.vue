<script setup lang="ts">
import { MSelect } from 'morya-ui'
import { ref } from 'vue'

const value = ref<Array<string | number>>([])
const options = [
  { label: 'Vue', value: 'vue' },
  { label: 'React', value: 'react' },
]
</script>

<template>
  <MSelect v-model="value" :options="options" mode="tags" show-search placeholder="Add a stack" />
</template>
