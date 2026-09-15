<script setup lang="ts">
import { MTree } from 'morya-ui'
import { ref } from 'vue'

const checkedKeys = ref({})
const nodes = [
  {
    key: '1',
    label: 'Guide',
    children: [
      { key: '1-1', label: 'Install' },
      { key: '1-2', label: 'Quick Start' },
    ],
  },
]
</script>

<template>
  <MTree
    v-model:checked-keys="checkedKeys"
    :value="nodes"
    show-checkbox
    default-expand-all
  />
</template>
