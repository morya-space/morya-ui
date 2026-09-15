<script setup lang="ts">
import { MTable } from 'morya-ui'

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'role', label: 'Role' },
]
const rows = [{ id: 1, name: 'Ada', role: 'Designer', extra: 'Design system' }]
</script>

<template>
  <MTable :columns="columns" :rows="rows" expandable bordered :paginator="false">
    <template #expansion="{ row }">
      {{ row.extra }}
    </template>
  </MTable>
</template>
