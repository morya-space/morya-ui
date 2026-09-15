<script setup lang="ts">
import { MButton, MSidebar } from 'morya-ui'
import { ref } from 'vue'

const collapsed = ref(false)
const model = [
  { label: '概览', icon: '▦' },
  {
    label: '项目',
    icon: '☰',
    items: [{ label: '全部' }, { label: '归档' }],
  },
  { label: '设置', icon: '⚙' },
]
</script>

<template>
  <div style="display:flex;gap:1rem;align-items:flex-start">
    <MSidebar :model="model" :collapsed="collapsed" />
    <MButton :label="collapsed ? '展开' : '折叠'" size="small" @click="collapsed = !collapsed" />
  </div>
</template>
