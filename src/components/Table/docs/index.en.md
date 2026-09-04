---
title: Table
category: 03 / DATA
description: Data table with sorting, filtering, selection, pagination, frozen columns, and empty/loading states. Column width supports width / minWidth / fit.
---

# Table

`WdTable` displays structured row data. Define columns with `columns`, pass data with `rows`, and use built-in client-side sort, filter, pagination, and row selection—or switch to server-driven pagination.

Column width rules:

- Columns with `width` use a fixed width
- Columns without `width` are flexible with a `minWidth` lower bound (default `80`); when `fit` is `true` (default), remaining width is distributed proportionally
- Horizontal scrolling appears when the total minimum width exceeds the container

## Import

```ts
import { WdTable, WdTag } from '@wex-design/ui'
import type { TableColumnDefinition, TableItem } from '@wex-design/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { WdTable, WdTag } from '@wex-design/ui'

const columns = [
  { key: 'name', label: 'Project', minWidth: 140, sortable: true },
  { key: 'status', label: 'Status', width: 120 },
  { key: 'owner', label: 'Owner', minWidth: 100 },
]
const rows = [
  { id: 1, name: 'Landing Redesign', status: 'Published', owner: 'Ada' },
  { id: 2, name: 'Dashboard v2', status: 'Draft', owner: 'Lin' },
]
</script>

<template>
  <WdTable :columns="columns" :rows="rows" striped bordered>
    <template #cell-status="{ value }">
      <WdTag
        :value="String(value)"
        :severity="value === 'Published' ? 'success' : 'secondary'"
      />
    </template>
  </WdTable>
</template>
```

## Selection

Use `selection-mode="multiple"` with `v-model:selection`, or `selection-mode="single"` with `v-model:selected-item`.

```vue preview
<script setup lang="ts">
import { WdTable } from '@wex-design/ui'
import { ref } from 'vue'

const columns = [
  { key: 'name', label: 'Name', minWidth: 120 },
  { key: 'role', label: 'Role', minWidth: 120 },
]
const rows = [
  { id: 1, name: 'Ada', role: 'Designer' },
  { id: 2, name: 'Lin', role: 'Engineer' },
]
const selection = ref<Record<string, unknown>[]>([])
</script>

<template>
  <WdTable
    v-model:selection="selection"
    :columns="columns"
    :rows="rows"
    selection-mode="multiple"
    highlight-current
    :paginator="false"
  />
</template>
```

## Filter and pagination

Use `search-value` / `filter-options` for client filtering. Enable `paginator` with `v-model:page` and `rows-per-page`.

```vue preview
<script setup lang="ts">
import { WdTable } from '@wex-design/ui'
import { ref } from 'vue'

const columns = [
  { key: 'name', label: 'Name', sortable: true, minWidth: 120 },
  { key: 'role', label: 'Role', minWidth: 120 },
]
const rows = [
  { id: 1, name: 'Ada', role: 'Designer' },
  { id: 2, name: 'Lin', role: 'Engineer' },
  { id: 3, name: 'Kai', role: 'Engineer' },
  { id: 4, name: 'Mia', role: 'Designer' },
]
const page = ref(1)
</script>

<template>
  <WdTable
    v-model:page="page"
    :columns="columns"
    :rows="rows"
    paginator
    :rows-per-page="2"
  />
</template>
```

## Expandable rows

Set `expandable` and provide the `expansion` slot. Column `render` works for custom cells; a `cell-{key}` slot overrides `render`.

```vue preview
<script setup lang="ts">
import { WdTable } from '@wex-design/ui'

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'role', label: 'Role' },
]
const rows = [{ id: 1, name: 'Ada', role: 'Designer', extra: 'Design system' }]
</script>

<template>
  <WdTable :columns="columns" :rows="rows" expandable bordered :paginator="false">
    <template #expansion="{ row }">
      {{ row.extra }}
    </template>
  </WdTable>
</template>
```

## Empty and loading

```vue preview
<script setup lang="ts">
import { WdButton, WdTable } from '@wex-design/ui'
import { ref } from 'vue'

const loading = ref(false)
const columns = [
  { key: 'name', label: 'Name', minWidth: 120 },
  { key: 'role', label: 'Role', minWidth: 120 },
]
</script>

<template>
  <div style="display:grid;gap:0.75rem">
    <WdButton :label="loading ? 'Stop loading' : 'Start loading'" @click="loading = !loading" />
    <WdTable
      :columns="columns"
      :rows="[]"
      :loading="loading"
      empty-text="No data yet"
      empty-description="Records will appear here after you create the first one"
      :paginator="false"
    />
  </div>
</template>
```

## TableColumnDefinition

| Field | Type | Description |
| --- | --- | --- |
| `key` | `string` | Field name bound to row data. |
| `label` | `string` | Column header text. |
| `width` | `number` | Fixed width in px. |
| `minWidth` | `number` | Flex column minimum width; default `80`. |
| `sortable` | `boolean` | Enable sorting. |
| `fixed` | `boolean \| 'left' \| 'right'` | Freeze column (left freeze supported). |
| `align` | `'start' \| 'center' \| 'end'` | Cell alignment. |
| `render` | `(row) => unknown` | Custom cell renderer. |
| `showOverflowTooltip` | `boolean` | Tooltip when cell text overflows. |

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `columns` | `TableColumnDefinition[]` | — | Column definitions. |
| `rows` | `TableItem[]` | — | Row data. |
| `fit` | `boolean` | `true` | Flexible columns fill remaining width. |
| `selectionMode` | `'single' \| 'multiple' \| null` | `null` | Row selection mode. |
| `selection` | `TableItem[] \| null` | `null` | Multi-select (`v-model:selection`). |
| `paginator` | `boolean` | `false` | Built-in pagination footer. |
| `page` | `number` | `1` | Current page (`v-model:page`). |
| `rowsPerPage` | `number` | `25` | Page size. |
| `striped` / `bordered` | `boolean` | `false` | Striped rows / cell borders. |
| `highlightCurrent` | `boolean` | `false` | Highlight current row. |
| `loading` / `emptyText` / `emptyDescription` | — | — | Loading and empty states. |
| `maxHeight` | `number \| null` | `null` | Scrollable body max height. |
| `rowKey` | `string` | `'id'` | Stable row key field. |
| `size` | `'sm' \| 'md' \| 'lg'` | — | Table density. |

## Slots

| Slot | Description |
| --- | --- |
| `cell-{key}` | Cell for column `{key}`; scope `{ row, value, column }`. |
| `body-cell` | Any cell; scope `{ row, column, value }`. |
| `expansion` | Expanded row; scope `{ row }`. |
| `empty` / `loading` | Empty and loading placeholders. |

## Events

| Event | Payload | Description |
| --- | --- | --- |
| `sort` | `{ sortField?, sortOrder? }` | Sort changed. |
| `page` | `number` | Page changed. |
| `row-click` | `{ row, index }` | Row clicked. |
| `current-change` | `row \| null, oldRow \| null` | Current row changed. |
| `update:selection` | `TableItem[]` | Selection v-model. |
| `update:page` | `number` | Page v-model. |

## Instance

Exposed pagination helpers include `nextPage`, `prevPage`, `updatePage`, `currentPaginationNumber`, and `maxPaginationNumber`.
