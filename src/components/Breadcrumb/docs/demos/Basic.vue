<script setup lang="ts">
import { MBreadcrumb } from 'morya-ui'

const items = [
  { label: 'Electronics', to: '/electronics' },
  { label: 'Computer', to: '/electronics/computer' },
  { label: 'Accessories' },
]
</script>

<template>
  <MBreadcrumb :home="{ label: 'Home', to: '/' }" :model="items" />
</template>
