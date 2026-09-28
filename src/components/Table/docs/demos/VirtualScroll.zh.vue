<script setup lang="ts">
import { MTable } from 'morya-ui'

const columns = [
  { key: 'id', label: 'ID', width: 80 },
  { key: 'name', label: '姓名', minWidth: 160 },
]

const rows = Array.from({ length: 5000 }, (_, i) => ({
  id: i + 1,
  name: `行 ${i + 1}`,
}))
</script>

<template>
  <MTable
    :columns="columns"
    :rows="rows"
    virtual
    :virtual-row-height="40"
    :max-height="320"
    bordered
    :paginator="false"
  />
</template>
