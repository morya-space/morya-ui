<script setup lang="ts">
import type { TableItem } from 'morya-ui'
import { MTable } from 'morya-ui'

type Row = { id: number; name: string; role: string; extra: string }

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'role', label: 'Role' },
]
const rows: Row[] = [{ id: 1, name: 'Ada', role: 'Designer', extra: 'Design system' }]

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
