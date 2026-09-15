<script setup lang="ts">
import { MMenubar } from 'morya-ui'
import { ref } from 'vue'

const selectedKey = ref<string | null>(null)
const model = [
  {
    key: 'file',
    label: '文件',
    icon: 'edit',
    items: [{ key: 'new', label: '新建' }, { key: 'open', label: '打开' }],
  },
  { key: 'edit', label: '编辑', icon: 'home' },
]
</script>

<template>
  <MMenubar v-model:selected-key="selectedKey" :model="model" />
</template>
