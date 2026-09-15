<script setup lang="ts">
import { MBreadcrumb } from 'morya-ui'

const items = [
  { label: 'Library', to: '/lib' },
  { label: 'Docs' },
]
</script>

<template>
  <MBreadcrumb :model="items" separator=">" />
</template>
