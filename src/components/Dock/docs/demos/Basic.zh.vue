<script setup lang="ts">
import { MDock } from 'morya-ui'

const model = [
  { label: '主页', icon: '⌂' },
  { label: '搜索', icon: '⌕' },
  { label: '设置', icon: '⚙' },
]
</script>

<template>
  <MDock :model="model" />
</template>
