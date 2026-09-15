<script setup lang="ts">
import { MInput, MTree } from 'morya-ui'
import { ref } from 'vue'

const query = ref('')
const nodes = [
  {
    key: 'a',
    label: 'Components',
    children: [
      { key: 'a-1', label: 'Button' },
      { key: 'a-2', label: 'Table' },
      { key: 'a-3', label: 'Tree' },
    ],
  },
]
</script>

<template>
  <div style="display:grid;gap:0.75rem;max-width:20rem">
    <MInput v-model="query" placeholder="Filter nodes" clearable fluid />
    <MTree :value="nodes" :filter="query" default-expand-all />
  </div>
</template>
