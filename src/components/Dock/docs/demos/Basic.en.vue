<script setup lang="ts">
import { MDock } from 'morya-ui'

const model = [
  { label: 'Home', icon: '⌂' },
  { label: 'Search', icon: '⌕' },
  { label: 'Settings', icon: '⚙' },
]
</script>

<template>
  <MDock :model="model" />
</template>
