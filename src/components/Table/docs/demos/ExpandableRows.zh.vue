<script setup lang="ts">
import { MTable } from 'morya-ui'

const columns = [
  { key: 'name', label: '姓名', width: 120, fixed: 'left' as const },
  { key: 'q1', label: 'Q1 营收', width: 140 },
  { key: 'q2', label: 'Q2 营收', width: 140 },
  { key: 'q3', label: 'Q3 营收', width: 140 },
  { key: 'action', label: '操作', width: 100 },
]
const rows = [
  { id: 1, name: 'Ada', q1: '12.4万', q2: '13.1万', q3: '14.0万', action: '编辑' },
  { id: 2, name: 'Lin', q1: '9.8万', q2: '10.2万', q3: '11.5万', action: '编辑' },
]
</script>

<template>
  <MTable :columns="columns" :rows="rows" bordered :paginator="false" />
</template>
