---
title: Table
category: 06 / DATA
description: Data table. Supports sorting, filtering, selection, pagination, frozen columns, and empty/loading states. Column width supports width / minWidth / fit.
---

# Table

Data table. Column width rules:

- Columns with `width` use a fixed width
- Columns without `width` are flexible using `minWidth` (default `80`); when `fit` is `true` (default), remaining width is distributed proportionally
- Horizontal scrolling appears when the total minimum width exceeds the container

**Aligned subset:** column `render`, slots `body-cell` / `expansion`, expandable rows. Virtual scroll, tree-table, and cell editing are out of scope.

## Import

```ts
import { WiTable, WiTag } from '@well-insight/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { WiTable, WiTag } from '@well-insight/ui'

const columns = [
  { key: 'name', label: 'Project', minWidth: 140, sortable: true },
  { key: 'status', label: 'Status', width: 120 },
  { key: 'owner', label: 'Owner', minWidth: 100 },
  { key: 'team', label: 'Team', minWidth: 120 },
  { key: 'progress', label: 'Progress', width: 100, align: 'end' as const },
]
const rows = [
  { id: 1, name: 'Landing Redesign', status: 'Published', owner: 'Ada', team: 'Design', progress: '100%' },
  { id: 2, name: 'Dashboard v2', status: 'Draft', owner: 'Lin', team: 'Frontend', progress: '62%' },
  { id: 3, name: 'Auth Gateway', status: 'Review', owner: 'Kai', team: 'Backend', progress: '88%' },
  { id: 4, name: 'Billing Export', status: 'Published', owner: 'Mia', team: 'Platform', progress: '100%' },
  { id: 5, name: 'Mobile Shell', status: 'Draft', owner: 'Neo', team: 'Mobile', progress: '35%' },
  { id: 6, name: 'Search Index', status: 'Published', owner: 'Ada', team: 'Data', progress: '100%' },
  { id: 7, name: 'Notification Hub', status: 'Review', owner: 'Lin', team: 'Backend', progress: '74%' },
  { id: 8, name: 'Design Tokens', status: 'Draft', owner: 'Kai', team: 'Design', progress: '51%' },
]
</script>

<template>
  <WiTable :columns="columns" :rows="rows" striped bordered>
    <template #cell-status="{ value }">
      <WiTag
        :value="String(value)"
        :severity="value === 'Published' ? 'success' : value === 'Review' ? 'warn' : 'secondary'"
      />
    </template>
  </WiTable>
</template>
```

## Selection

```vue preview
<script setup lang="ts">
import { WiTable } from '@well-insight/ui'
import { ref } from 'vue'

const columns = [
  { key: 'name', label: 'Name', minWidth: 120 },
  { key: 'role', label: 'Role', minWidth: 120 },
  { key: 'dept', label: 'Department', minWidth: 120 },
  { key: 'city', label: 'City', minWidth: 100 },
  { key: 'level', label: 'Level', width: 90 },
]
const rows = [
  { id: 1, name: 'Ada', role: 'Designer', dept: 'Design', city: 'Shanghai', level: 'P6' },
  { id: 2, name: 'Lin', role: 'Engineer', dept: 'Frontend', city: 'Hangzhou', level: 'P5' },
  { id: 3, name: 'Kai', role: 'PM', dept: 'Product', city: 'Beijing', level: 'P7' },
  { id: 4, name: 'Mia', role: 'Engineer', dept: 'Backend', city: 'Chengdu', level: 'P5' },
  { id: 5, name: 'Neo', role: 'Designer', dept: 'Design', city: 'Shenzhen', level: 'P4' },
  { id: 6, name: 'Zoe', role: 'Engineer', dept: 'Mobile', city: 'Shanghai', level: 'P6' },
  { id: 7, name: 'Rex', role: 'QA', dept: 'Quality', city: 'Wuhan', level: 'P5' },
  { id: 8, name: 'Ivy', role: 'Engineer', dept: 'Platform', city: 'Guangzhou', level: 'P6' },
  { id: 9, name: 'Jon', role: 'PM', dept: 'Product', city: 'Beijing', level: 'P6' },
  { id: 10, name: 'Amy', role: 'Designer', dept: 'Design', city: 'Hangzhou', level: 'P5' },
]
const selection = ref([])
</script>

<template>
  <WiTable
    v-model:selection="selection"
    :columns="columns"
    :rows="rows"
    selection-mode="multiple"
    highlight-current
  />
</template>
```

## Filter + Pagination

```vue preview
<script setup lang="ts">
import { WiTable } from '@well-insight/ui'
import { ref } from 'vue'

const columns = [
  { key: 'name', label: 'Name', filterable: true, sortable: true, minWidth: 120 },
  {
    key: 'role',
    label: 'Role',
    filterable: true,
    minWidth: 120,
    filters: [
      { label: 'Engineer', value: 'Engineer' },
      { label: 'Designer', value: 'Designer' },
      { label: 'PM', value: 'PM' },
      { label: 'QA', value: 'QA' },
    ],
  },
  { key: 'dept', label: 'Department', minWidth: 120, sortable: true },
  { key: 'email', label: 'Email', minWidth: 180 },
]
const rows = [
  { id: 1, name: 'Ada', role: 'Designer', dept: 'Design', email: 'ada@well.design' },
  { id: 2, name: 'Lin', role: 'Engineer', dept: 'Frontend', email: 'lin@well.design' },
  { id: 3, name: 'Kai', role: 'Engineer', dept: 'Backend', email: 'kai@well.design' },
  { id: 4, name: 'Mia', role: 'Designer', dept: 'Design', email: 'mia@well.design' },
  { id: 5, name: 'Neo', role: 'Engineer', dept: 'Mobile', email: 'neo@well.design' },
  { id: 6, name: 'Zoe', role: 'PM', dept: 'Product', email: 'zoe@well.design' },
  { id: 7, name: 'Rex', role: 'QA', dept: 'Quality', email: 'rex@well.design' },
  { id: 8, name: 'Ivy', role: 'Engineer', dept: 'Platform', email: 'ivy@well.design' },
  { id: 9, name: 'Jon', role: 'PM', dept: 'Product', email: 'jon@well.design' },
  { id: 10, name: 'Amy', role: 'Designer', dept: 'Design', email: 'amy@well.design' },
  { id: 11, name: 'Ben', role: 'Engineer', dept: 'Frontend', email: 'ben@well.design' },
  { id: 12, name: 'Cara', role: 'QA', dept: 'Quality', email: 'cara@well.design' },
]
const page = ref(1)
</script>

<template>
  <WiTable
    v-model:page="page"
    :columns="columns"
    :rows="rows"
    paginator
    :rows-per-page="5"
  />
</template>
```

## Fixed columns

```vue preview
<script setup lang="ts">
import { WiTable } from '@well-insight/ui'

const columns = [
  { key: 'name', label: 'Name', width: 120, fixed: 'left' as const },
  { key: 'q1', label: 'Q1 Revenue', width: 140 },
  { key: 'q2', label: 'Q2 Revenue', width: 140 },
  { key: 'q3', label: 'Q3 Revenue', width: 140 },
  { key: 'q4', label: 'Q4 Revenue', width: 140 },
  { key: 'yoy', label: 'YoY', width: 100 },
  { key: 'action', label: 'Action', width: 100, fixed: 'right' as const },
]
const rows = [
  { id: 1, name: 'Ada', q1: '124k', q2: '131k', q3: '140k', q4: '152k', yoy: '+18%', action: 'Edit' },
  { id: 2, name: 'Lin', q1: '98k', q2: '102k', q3: '115k', q4: '120k', yoy: '+12%', action: 'Edit' },
  { id: 3, name: 'Kai', q1: '150k', q2: '146k', q3: '161k', q4: '173k', yoy: '+9%', action: 'Edit' },
  { id: 4, name: 'Mia', q1: '82k', q2: '89k', q3: '94k', q4: '101k', yoy: '+21%', action: 'Edit' },
  { id: 5, name: 'Neo', q1: '113k', q2: '110k', q3: '122k', q4: '135k', yoy: '+7%', action: 'Edit' },
  { id: 6, name: 'Zoe', q1: '105k', q2: '118k', q3: '124k', q4: '130k', yoy: '+15%', action: 'Edit' },
]
</script>

<template>
  <WiTable :columns="columns" :rows="rows" bordered />
</template>
```

## Expandable + column render

Use column `render` for custom cells. `expandable` rows are rendered by the `expansion` slot. A named `cell-{key}` slot still wins over `render`.

```vue preview
<script setup lang="ts">
import { WiTable } from '@well-insight/ui'
import { ref } from 'vue'

const expandedRowKeys = ref<Array<string | number>>([])
const columns = [
  { key: 'name', label: 'Name', render: (row: { name: string }) => `*${row.name}*` },
  { key: 'role', label: 'Role' },
]
const rows = [
  { id: 1, name: 'Ada', role: 'Designer', extra: 'Design system' },
  { id: 2, name: 'Lin', role: 'Engineer', extra: 'Frontend' },
]
</script>

<template>
  <WiTable
    v-model:expanded-row-keys="expandedRowKeys"
    :columns="columns"
    :rows="rows"
    expandable
    bordered
  >
    <template #expansion="{ row }">
      {{ row.extra }}
    </template>
  </WiTable>
</template>
```

## Empty / Loading

```vue preview
<script setup lang="ts">
import { WiButton, WiTable } from '@well-insight/ui'
import { ref } from 'vue'

const loading = ref(false)
const columns = [
  { key: 'name', label: 'Name', minWidth: 120 },
  { key: 'role', label: 'Role', minWidth: 120 },
  { key: 'dept', label: 'Department', minWidth: 120 },
]
</script>

<template>
  <div style="display:grid;gap:0.75rem">
    <WiButton :label="loading ? 'Stop loading' : 'Start loading'" @click="loading = !loading" />
    <WiTable
      :columns="columns"
      :rows="[]"
      :loading="loading"
      empty-text="No data yet"
      empty-description="Records will appear here after you create the first one"
    />
  </div>
</template>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `columns` | `TableColumn[]` | — | Column definitions: `width` is fixed; `minWidth` is the flex lower bound (default 80); optional `render`. |
| `fit` | `boolean` | `true` | Whether flexible columns share remaining width proportionally. |
| `rows` | `Record[]` | — | Row data. |
| `selectionMode` | `'single' \| 'multiple'` | — | Row selection. |
| `selection` | — | — | `v-model:selection`. |
| `filters` | `Record` | `{}` | `v-model:filters`. |
| `paginator` | `boolean` | `false` | Built-in pagination. |
| `rowsPerPage` / `page` | — | `10` / `1` | Pagination. |
| `expandable` | `boolean` | `false` | Expand column; use slot `expansion` for the extra row. |
| `expandedRowKeys` | `Array<string \| number>` | `[]` | `v-model:expanded-row-keys`. |
| `rowExpandable` | `(row) => boolean` | — | Return `false` to disable expand on that row. |
| `striped` / `bordered` / `highlightCurrent` / `rowHover` | `boolean` | — | Appearance. |
| `sortMode` | `'client' \| 'emit'` | `'client'` | Client-side sort or emit-only. |
| `sortField` / `sortOrder` | — | — | Controlled sort. |
| `loading` / `emptyText` / `emptyDescription` / `size` | — | — | Same as above. |

## Slots

| Slot | Description |
| --- | --- |
| `cell-{key}` | Cell for column `{key}`; wins over column `render`. |
| `body-cell` | Scope `{ row, column, value }` for any cell. |
| `expansion` | Expanded row content, scope `{ row }`. |
| `empty` | Empty state. |
| `loading` | Loading state. |

## Events

| Event | Payload | Description |
| --- | --- | --- |
| `sort` | `{ sortField?, sortOrder }` | Sort change (`sortMode="emit"` or controlled sort). |
| `filter` | `TableFilters` | Filter change. |
| `page` | `number` | Page change. |
| `row-click` | `{ row, index }` | Row clicked. |
| `current-change` | `row \| null` | Highlighted row change. |
| `expand` | `{ row, expanded }` | Row expand/collapse. |
| `update:selection` | `selection` | Selection change with `v-model:selection`. |
| `update:filters` | `TableFilters` | Filters v-model. |
| `update:page` | `number` | Page v-model. |
| `update:expanded-row-keys` | `Array<string \| number>` | Expanded row keys v-model. |
