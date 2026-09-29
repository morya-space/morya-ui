<script setup lang="ts">
import type { TableColumnDefinition, TableItem } from 'morya-ui'
import { MTable } from 'morya-ui'
import { ref } from 'vue'

const columns: TableColumnDefinition[] = [
  { key: 'name', label: 'Name' },
  { key: 'size', label: 'Size' },
]

const rows = ref<TableItem[]>([
  {
    id: 1,
    name: 'Applications',
    size: '100kb',
    children: [
      { id: 11, name: 'Vue', size: '25kb' },
      { id: 12, name: 'React', size: '30kb' },
    ],
  },
  {
    id: 2,
    name: 'Documents',
    size: '40kb',
    children: [{ id: 21, name: 'README.md', size: '4kb' }],
  },
])

const expandedRowKeys = ref<Array<string | number>>([1])
const selection = ref<TableItem[]>([])
</script>

<template>
  <MTable
    v-model:expanded-row-keys="expandedRowKeys"
    v-model:selection="selection"
    selection-mode="multiple"
    :columns="columns"
    :rows="rows"
    :tree-config="{ childrenField: 'children', indent: 16 }"
    :checkbox-config="{ checkStrictly: false }"
    bordered
    :paginator="false"
  />
</template>
