<script setup lang="ts">
import type { TableSortConfig } from 'morya-ui'
import { MTable } from 'morya-ui'
import { ref } from 'vue'

const columns = [
  { key: 'name', label: 'Project', minWidth: 160, sortable: true },
  { key: 'owner', label: 'Owner', minWidth: 100, sortable: true },
  { key: 'progress', label: 'Progress', width: 110, align: 'end' as const, sortable: true },
]

const rows = [
  { id: 1, name: 'Landing Redesign', owner: 'Ada', progress: 100 },
  { id: 2, name: 'Dashboard v2', owner: 'Lin', progress: 62 },
  { id: 3, name: 'Auth Gateway', owner: 'Kai', progress: 88 },
  { id: 4, name: 'Billing Migration', owner: 'Ada', progress: 24 },
]

const sortConfig = ref<TableSortConfig>({
  field: 'progress',
  order: 'desc',
  mode: 'client',
})
</script>

<template>
  <MTable :columns="columns" :rows="rows" :sort-config="sortConfig" bordered striped />
</template>
