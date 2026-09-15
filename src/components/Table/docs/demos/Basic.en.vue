<script setup lang="ts">
import { MTable, MTag } from 'morya-ui'

const columns = [
  { key: 'name', label: 'Project', minWidth: 140, sortable: true },
  { key: 'status', label: 'Status', width: 120 },
  { key: 'owner', label: 'Owner', minWidth: 100 },
]
const rows = [
  { id: 1, name: 'Landing Redesign', status: 'Published', owner: 'Ada' },
  { id: 2, name: 'Dashboard v2', status: 'Draft', owner: 'Lin' },
]
</script>

<template>
  <MTable :columns="columns" :rows="rows" striped bordered>
    <template #cell-status="{ value }">
      <MTag
        :value="String(value)"
        :severity="value === 'Published' ? 'success' : 'secondary'"
      />
    </template>
  </MTable>
</template>
