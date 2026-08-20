---
title: TreeTable
category: 06 / DATA
description: Expandable tree table.
---

# TreeTable

Display tree data with children using column configuration.

## Import

```ts
import { WiTreeTable } from '@well-insight/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { WiTreeTable } from '@well-insight/ui'

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
  <WiTreeTable :value="value" :columns="columns" />
</template>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `TreeTableNode[]` | — | Tree row data. |
| `columns` | `TreeTableColumn[]` | — | Column definitions. |

## Events

| Event | Prop | Description |
| --- | --- | --- |
| `node-expand` | `TreeTableNode` | Emitted when a node expands. |
| `node-collapse` | `TreeTableNode` | Emitted when a node collapses. |
