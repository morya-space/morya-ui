<script setup lang="ts">
import { MSpeedDial } from 'morya-ui'
import { ref } from 'vue'

const open = ref(false)
const items = [
  { label: '编辑', icon: '✎' },
  { label: '删除', icon: '🗑' },
  { label: '分享', icon: '↗' },
]
</script>

<template>
  <div style="min-height:8rem;display:flex;align-items:flex-end;justify-content:center">
    <MSpeedDial v-model="open" :model="items" direction="up" />
  </div>
</template>
