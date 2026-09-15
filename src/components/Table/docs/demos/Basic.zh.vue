<script setup lang="ts">
import { MTable, MTag } from 'morya-ui'

const columns = [
  { key: 'name', label: '项目', minWidth: 140, sortable: true },
  { key: 'status', label: '状态', width: 120 },
  { key: 'owner', label: '负责人', minWidth: 100 },
  { key: 'team', label: '团队', minWidth: 120 },
  { key: 'progress', label: '进度', width: 100, align: 'end' as const },
]
const rows = [
  { id: 1, name: 'Landing Redesign', status: 'Published', owner: 'Ada', team: 'Design', progress: '100%' },
  { id: 2, name: 'Dashboard v2', status: 'Draft', owner: 'Lin', team: 'Frontend', progress: '62%' },
  { id: 3, name: 'Auth Gateway', status: 'Review', owner: 'Kai', team: 'Backend', progress: '88%' },
]
</script>

<template>
  <MTable :columns="columns" :rows="rows" striped bordered>
    <template #cell-status="{ value }">
      <MTag
        :value="String(value)"
        :severity="value === 'Published' ? 'success' : value === 'Review' ? 'warn' : 'secondary'"
      />
    </template>
  </MTable>
</template>
