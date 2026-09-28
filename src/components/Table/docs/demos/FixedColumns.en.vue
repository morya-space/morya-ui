<script setup lang="ts">
import { MTable } from 'morya-ui'

const columns = [
  { key: 'name', label: 'Name', width: 120, fixed: 'left' as const },
  { key: 'q1', label: 'Q1 Revenue', width: 140 },
  { key: 'q2', label: 'Q2 Revenue', width: 140 },
  { key: 'q3', label: 'Q3 Revenue', width: 140 },
  { key: 'action', label: 'Action', width: 100, fixed: 'right' as const },
]
const rows = [
  { id: 1, name: 'Ada', q1: '124k', q2: '131k', q3: '140k', action: 'Edit' },
  { id: 2, name: 'Lin', q1: '98k', q2: '102k', q3: '115k', action: 'Edit' },
]
</script>

<template>
  <MTable :columns="columns" :rows="rows" bordered :paginator="false" />
</template>
