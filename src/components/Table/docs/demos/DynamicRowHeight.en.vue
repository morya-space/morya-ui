<script setup lang="ts">
import { MTable } from 'morya-ui'

const columns = [
  { key: 'id', label: 'ID', width: 80 },
  { key: 'title', label: 'Title', minWidth: 200 },
  { key: 'summary', label: 'Summary', minWidth: 320 },
]

// Rows with variable content length → variable row height
const rows = Array.from({ length: 2000 }, (_, i) => ({
  id: i + 1,
  title: `Task ${i + 1}`,
  summary: i % 7 === 0
    ? 'A longer summary used to demonstrate dynamic row height. '.repeat((i % 5) + 2)
    : `Short summary ${i + 1}`,
}))
</script>

<template>
  <MTable
    :columns="columns"
    :rows="rows"
    virtual
    virtual-dynamic-row-height
    :virtual-row-height="44"
    :max-height="360"
    bordered
    :paginator="false"
  />
</template>
