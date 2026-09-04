---
title: TreeTable
category: 03 / DATA
description: 可展开的树形表格。
---

# TreeTable

用列配置展示带 children 的树形数据。

## 引入

```ts
import { WdTreeTable } from '@wex-design/ui'
```

## 基础用法

```vue preview
<script setup lang="ts">
import { WdTreeTable } from '@wex-design/ui'

const columns = [
  { field: 'name', header: '名称' },
  { field: 'size', header: '大小' },
]
const value = [
  {
    key: '0',
    data: { name: '应用', size: '100kb' },
    children: [
      { key: '0-0', data: { name: 'Vue', size: '25kb' } },
      { key: '0-1', data: { name: 'React', size: '30kb' } },
    ],
  },
]
</script>

<template>
  <WdTreeTable :value="value" :columns="columns" />
</template>
```

## Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `value` | `TreeTableNode[]` | — | 树形行数据。 |
| `columns` | `TreeTableColumn[]` | — | 列定义。 |
| `emptyMessage` | `string` | — | — |
| `expandedKeys` | `Record<string, boolean>` | — | — |

## Events

| 事件名 | 参数 | 说明 |
| --- | --- | --- |
| `node-expand` | `TreeTableNode` | 节点展开。 |
| `node-collapse` | `TreeTableNode` | 节点折叠。 |
| `update:expandedKeys` | — | — |

## Slots

| 插槽名 | 说明 |
| --- | --- |
| `expansion` | 展开行 `{ row }`。 |
| `empty` | 自定义 `empty` 内容。 |
