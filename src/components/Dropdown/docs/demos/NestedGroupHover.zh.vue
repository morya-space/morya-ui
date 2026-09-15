<script setup lang="ts">
import { MButton, MDropdown } from 'morya-ui'
import { ref } from 'vue'

const open = ref(false)
const items = [
  { type: 'group' as const, label: '编辑', items: [{ value: 'cut', label: '剪切' }, { value: 'copy', label: '复制' }] },
  { separator: true },
  { value: 'more', label: '更多', items: [{ value: 'deep', label: '深层操作' }] },
]
</script>

<template>
  <MDropdown v-model="open" :items="items" trigger="hover" :show-delay="0" :hide-delay="200">
    <template #trigger>
      <MButton label="悬停打开" severity="secondary" />
    </template>
  </MDropdown>
</template>
