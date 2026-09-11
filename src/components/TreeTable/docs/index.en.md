---
title: TreeTable
category: 03 / DATA
description: Expandable tree table.
---

# TreeTable

Display tree data with children using column configuration.

## Import

```ts
import { MTreeTable } from 'morya-ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { MTreeTable } from 'morya-ui'

const columns = [
  { field: 'name', header: 'Name' },
  { field: 'size', header: 'Size' },
]
const value = [
  {
    key: '0',
    data: { name: 'Applications', size: '100kb' },
    children: [
      { key: '0-0', data: { name: 'Vue', size: '25kb' } },
      { key: '0-1', data: { name: 'React', size: '30kb' } },
    ],
  },
]
</script>

<template>
  <MTreeTable :value="value" :columns="columns" />
</template>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `TreeTableNode[]` | — | Tree row data. |
| `columns` | `TreeTableColumn[]` | — | Column definitions. |
| `pt` | [RootPassThrough](/docs/types#RootPassThrough) `{ root? }` | — | Pass-through; see [Styling & attrs](/docs/attrs). |


## Events

| Event | Prop | Description |
| --- | --- | --- |
| `node-expand` | `TreeTableNode` | Emitted when a node expands. |
| `node-collapse` | `TreeTableNode` | Emitted when a node collapses. |

## Slots

| Slot | Description |
| --- | --- |
| `expansion` | Expanded row `{ row }`. |

## Types

<h4 id="TreeTableColumn">TreeTableColumn</h4>

See source `types.ts` for the full definition.

```ts
interface TreeTableColumn {
  field: string
  header: string
}
```

<h4 id="TreeTableNode">TreeTableNode</h4>

See source `types.ts` for the full definition.

```ts
interface TreeTableNode {
  key: string
  data: Record<string, unknown>
  children?: TreeTableNode[]
}
```
