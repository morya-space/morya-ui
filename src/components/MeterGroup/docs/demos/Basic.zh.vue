<script setup lang="ts">
import { MMeterGroup } from 'morya-ui'

const value = [
  { label: '应用', value: 45, color: '#2563eb' },
  { label: '媒体', value: 25, color: '#16a34a' },
  { label: '其他', value: 15, color: '#ea580c' },
]
</script>

<template>
  <MMeterGroup :value="value" :max="100" />
</template>
