<script setup lang="ts">
import type { TableColumnDefinition } from 'morya-ui'
import { MTable } from 'morya-ui'
import { ref } from 'vue'

const columns: TableColumnDefinition[] = [
  {
    key: 'name',
    label: 'Name',
    width: 140,
    resizable: true,
    filterable: true,
  },
  {
    key: 'status',
    label: 'Status',
    width: 120,
    resizable: true,
    filterable: true,
    filters: [
      { text: 'Draft', value: 'Draft' },
      { text: 'Live', value: 'Live' },
    ],
  },
  { key: 'role', label: 'Role', minWidth: 120 },
]

const rows = [
  { id: 1, name: 'Ada', status: 'Draft', role: 'Designer' },
  { id: 2, name: 'Lin', status: 'Live', role: 'Engineer' },
  { id: 3, name: 'Kai', status: 'Live', role: 'Engineer' },
  { id: 4, name: 'Mia', status: 'Draft', role: 'Designer' },
]

const columnWidths = ref<Record<string, number>>({})
</script>

<template>
  <MTable
    v-model:column-widths="columnWidths"
    :columns="columns"
    :rows="rows"
    bordered
    :paginator="false"
  />
</template>
