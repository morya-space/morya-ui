<script setup lang="ts">
import { MTree } from 'morya-ui'
import { ref } from 'vue'

const checkedKeys = ref({})
const nodes = [
  {
    key: '1',
    label: '指南',
    children: [
      { key: '1-1', label: '安装' },
      { key: '1-2', label: '快速上手' },
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
