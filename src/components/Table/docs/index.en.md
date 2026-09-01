---
title: Table
category: 06 / DATA
description: Data table aligned with vue3-easy-data-table — headers/items, client/server pagination, multi-select, expand rows, built-in footer.
---

# Table

`WiTable` uses the **headers + items** model with built-in filter, sort, pagination, and multi-select (see [vue3-easy-data-table](https://github.com/HC200ok/vue3-easy-data-table)).

## Import

```ts
import { WiTable, WiTag } from '@well-insight/ui'
import type { TableHeader, TableItem } from '@well-insight/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { WiTable } from '@well-insight/ui'

const headers = [
  { text: 'Name', value: 'name', sortable: true },
  { text: 'Status', value: 'status', width: 120 },
]
const items = [
  { name: 'Landing', status: 'Published' },
  { name: 'Dashboard', status: 'Draft' },
]
</script>

<template>
  <WiTable :headers="headers" :items="items" alternating border-cell hide-footer />
</template>
```

## Cell slots

Use `#item-{value}`; slot scope is the row item:

```vue preview
<script setup lang="ts">
import { WiTable, WiTag } from '@well-insight/ui'

const headers = [
  { text: 'Name', value: 'name' },
  { text: 'Status', value: 'status', width: 120 },
]
const items = [{ name: 'Landing', status: 'Published' }]
</script>

<template>
  <WiTable :headers="headers" :items="items" hide-footer>
    <template #item-status="{ status }">
      <WiTag :value="String(status)" severity="success" />
    </template>
  </WiTable>
</template>
```

## Multi-select

Pass an array for `items-selected` (or `null` to disable):

```vue preview
<script setup lang="ts">
import { WiTable } from '@well-insight/ui'
import { ref } from 'vue'

const headers = [{ text: 'Name', value: 'name' }]
const items = [{ name: 'Ada' }, { name: 'Lin' }]
const itemsSelected = ref<Record<string, unknown>[]>([])
</script>

<template>
  <WiTable v-model:items-selected="itemsSelected" :headers="headers" :items="items" hide-footer />
</template>
```

## Core props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `headers` | `TableHeader[]` | — | Columns: `text`, `value`, `sortable`, `fixed`, `width` |
| `items` | `TableItem[]` | — | Row data |
| `itemsSelected` | `TableItem[] \| null` | `null` | Multi-select; `null` disables |
| `serverOptions` | `TableServerOptions \| null` | `null` | Server-side mode |
| `rowsPerPage` | `number` | `25` | Page size |
| `alternating` | `boolean` | `false` | Striped rows |
| `borderCell` | `boolean` | `false` | Cell borders |
| `hideFooter` | `boolean` | `false` | Hide built-in footer |
| `loading` / `emptyMessage` | — | — | Loading & empty states |

## Events

| Event | Description |
| --- | --- |
| `clickRow` | Row click / double-click |
| `updateSort` | Sort changed |
| `update:itemsSelected` | Selection v-model |
| `update:serverOptions` | Server options v-model |
| `expandRow` | Row expanded |
