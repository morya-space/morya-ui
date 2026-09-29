<script setup lang="ts">
import type { TableColumnDefinition, TableItem } from 'morya-ui'
import { MTable } from 'morya-ui'
import { ref } from 'vue'

const columns: TableColumnDefinition[] = [
  {
    key: 'info',
    label: 'Info',
    children: [
      { key: 'name', label: 'Name' },
      { key: 'role', label: 'Role' },
    ],
  },
  { key: 'score', label: 'Score', align: 'end' },
]

const rows = ref<TableItem[]>([
  { id: 1, name: 'Ada', role: 'Designer', score: 96 },
  { id: 2, name: 'Lin', role: 'Engineer', score: 88 },
  { id: 3, name: 'Kai', role: 'Engineer', score: 91 },
])

const hiddenColumns = ref<string[]>([])
</script>

<template>
  <MTable
    v-model:hidden-columns="hiddenColumns"
    :columns="columns"
    :rows="rows"
    bordered
    show-footer
    :footer-method="({ data }) => [[
      'Total',
      '',
      data.reduce((sum, row) => sum + Number(row.score ?? 0), 0),
    ]]"
    :span-method="({ column, rowIndex }) => {
      if (column.value === 'role' && rowIndex === 1) return { rowspan: 2, colspan: 1 }
      if (column.value === 'role' && rowIndex === 2) return { rowspan: 0, colspan: 0 }
      return { rowspan: 1, colspan: 1 }
    }"
    :paginator="false"
  />
</template>
