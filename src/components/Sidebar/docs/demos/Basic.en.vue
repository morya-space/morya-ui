<script setup lang="ts">
import { MButton, MSidebar } from 'morya-ui'
import { ref } from 'vue'

const collapsed = ref(false)
const model = [
  { label: 'Overview', icon: '▦' },
  {
    label: 'Projects',
    icon: '☰',
    items: [{ label: 'All' }, { label: 'Archive' }],
  },
  { label: 'Settings', icon: '⚙' },
]
</script>

<template>
  <div style="display:flex;gap:1rem;align-items:flex-start">
    <MSidebar :model="model" :collapsed="collapsed" />
    <MButton :label="collapsed ? 'Expand' : 'Collapse'" size="small" @click="collapsed = !collapsed" />
  </div>
</template>
