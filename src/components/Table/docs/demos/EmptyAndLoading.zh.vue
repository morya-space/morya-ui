<script setup lang="ts">
import { MTable } from 'morya-ui'

const columns = [
  { key: 'name', label: '姓名', render: (row: { name: string }) => `*${row.name}*` },
  { key: 'role', label: '角色' },
]
const rows = [
  { id: 1, name: 'Ada', role: 'Designer', extra: 'Design system' },
]
</script>

<template>
  <MTable :columns="columns" :rows="rows" expandable bordered :paginator="false">
    <template #expansion="{ row }">
      {{ row.extra }}
    </template>
  </MTable>
</template>
