<script setup lang="ts">
import { MMenubar } from 'morya-ui'
import { ref } from 'vue'

const selectedKey = ref<string | null>(null)
const model = [
  {
    key: 'file',
    label: 'File',
    icon: 'edit',
    items: [{ key: 'new', label: 'New' }, { key: 'open', label: 'Open' }],
  },
  { key: 'edit', label: 'Edit', icon: 'home' },
]
</script>

<template>
  <MMenubar v-model:selected-key="selectedKey" :model="model" />
</template>
