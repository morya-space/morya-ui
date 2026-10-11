<script setup lang="ts">
import { MTable, MTag } from 'morya-ui'
import { ref } from 'vue'

const columns = [
  { key: 'name', label: 'Project', minWidth: 140 },
  { key: 'status', label: 'Status', width: 120 },
  { key: 'owner', label: 'Owner', minWidth: 100 },
  { key: 'team', label: 'Team', minWidth: 120 },
  { key: 'progress', label: 'Progress', width: 100, align: 'end' as const },
]

const rows = [
  { id: 1, name: 'Landing Redesign', status: 'Published', owner: 'Ada', team: 'Design', progress: '100%' },
  { id: 2, name: 'Dashboard v2', status: 'Draft', owner: 'Lin', team: 'Frontend', progress: '62%' },
  { id: 3, name: 'Auth Gateway', status: 'Review', owner: 'Kai', team: 'Backend', progress: '88%' },
]

const columnOrder = ref<string[]>([])
</script>

<template>
  <MTable
    v-model:column-order="columnOrder"
    :columns="columns"
    :rows="rows"
    column-drag
    bordered
    striped
  >
    <template #cell-status="{ value }">
      <MTag
        :value="String(value)"
        :type="value === 'Published' ? 'success' : value === 'Review' ? 'warning' : 'secondary'"
      />
    </template>
  </MTable>
</template>
