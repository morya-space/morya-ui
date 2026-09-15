<script setup lang="ts">
import type { TableColumnDefinition, TableItem } from 'morya-ui'
import { MTable } from 'morya-ui'

type Row = { id: number; name: string; role: string; extra: string }

const columns: TableColumnDefinition[] = [
  { key: 'name', label: '姓名', render: (row) => `*${(row as Row).name}*` },
  { key: 'role', label: '角色' },
]
const rows: Row[] = [
  { id: 1, name: 'Ada', role: 'Designer', extra: 'Design system' },
]

function extraOf(row: TableItem) {
  return (row as Row).extra
}
</script>

<template>
  <MTable :columns="columns" :rows="rows" expandable bordered :paginator="false">
    <template #expansion="{ row }">
      {{ extraOf(row) }}
    </template>
  </MTable>
</template>
