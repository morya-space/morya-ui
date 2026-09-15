<script setup lang="ts">
import { MSplitButton } from 'morya-ui'

const items = [
  { label: '另存为', command: () => console.log('save as') },
  { label: '导出', command: () => console.log('export') },
]
</script>

<template>
  <MSplitButton label="保存" :model="items" @click="() => console.log('save')" />
</template>
