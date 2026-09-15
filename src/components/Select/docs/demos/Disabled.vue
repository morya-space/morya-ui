<script setup lang="ts">
import { MSelect } from 'morya-ui'

const options = [
  { label: 'Design', value: 'design' },
  { label: 'Development', value: 'dev' },
]
</script>

<template>
  <MSelect model-value="design" :options="options" disabled />
</template>
