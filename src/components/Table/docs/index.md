---
title: Table
category: 06 / DATA
description: 数据表格。API 对齐 vue3-easy-data-table：headers/items、客户端/服务端分页排序、多选、展开行与内置页脚。
---

# Table

`WiTable` 采用 **headers + items** 数据模型，内置筛选、排序、分页与多选逻辑（参考 [vue3-easy-data-table](https://github.com/HC200ok/vue3-easy-data-table)）。

## 引入

```ts
import { WiTable, WiTag } from '@well-insight/ui'
import type { TableHeader, TableItem } from '@well-insight/ui'
```

## 基础用法

```vue preview
<script setup lang="ts">
import { WiTable, WiTag } from '@well-insight/ui'

const headers = [
  { text: '项目', value: 'name', sortable: true },
  { text: '状态', value: 'status', width: 120 },
  { text: '负责人', value: 'owner' },
]
const items = [
  { name: 'Landing Redesign', status: 'Published', owner: 'Ada' },
  { name: 'Dashboard v2', status: 'Draft', owner: 'Lin' },
]
</script>

<template>
  <WiTable :headers="headers" :items="items" alternating border-cell hide-footer />
</template>
```

## 列插槽

使用 `#item-{value}` 自定义单元格（作用域为整行 item）：

```vue preview
<script setup lang="ts">
import { WiTable, WiTag } from '@well-insight/ui'

const headers = [
  { text: '项目', value: 'name' },
  { text: '状态', value: 'status', width: 120 },
]
const items = [
  { name: 'Landing', status: 'Published' },
  { name: 'Dashboard', status: 'Draft' },
]
</script>

<template>
  <WiTable :headers="headers" :items="items" hide-footer border-cell>
    <template #item-status="{ status }">
      <WiTag
        :value="String(status)"
        :severity="status === 'Published' ? 'success' : 'secondary'"
      />
    </template>
  </WiTable>
</template>
```

## 多选 / 单选

多选使用 **`WiCheckbox`**（`selection-mode="multiple"` + `v-model:items-selected`）；单选使用 **`WiRadio`**（`selection-mode="single"` + `v-model:selected-item`）。仍兼容仅传 `items-selected` 数组的旧写法。

```vue preview
<script setup lang="ts">
import { WiTable } from '@well-insight/ui'
import { ref } from 'vue'

const headers = [
  { text: '姓名', value: 'name' },
  { text: '角色', value: 'role' },
]
const items = [
  { id: 1, name: 'Ada', role: 'Designer' },
  { id: 2, name: 'Lin', role: 'Engineer' },
]
const itemsSelected = ref<Record<string, unknown>[]>([])
</script>

<template>
  <WiTable
    v-model:items-selected="itemsSelected"
    selection-mode="multiple"
    :headers="headers"
    :items="items"
    hide-footer
  />
</template>
```

## 展开行

提供 `#expand` 插槽时自动出现展开列：

```vue preview
<script setup lang="ts">
import { WiTable } from '@well-insight/ui'

const headers = [
  { text: '姓名', value: 'name' },
  { text: '角色', value: 'role' },
]
const items = [
  { name: 'Ada', role: 'Designer', extra: 'Design system' },
]
</script>

<template>
  <WiTable :headers="headers" :items="items" hide-footer border-cell>
    <template #expand="{ extra }">
      {{ extra }}
    </template>
  </WiTable>
</template>
```

## 服务端模式

传入 `server-options` 与 `server-items-length`，通过 `v-model:server-options` 同步页码、每页条数与排序。

| Element Plus | WiTable |
| --- | --- |
| `border` | `border`（外框 + 列分割线，等同 `borderCell`） |
| `stripe` | `stripe` 或 `alternating` |
| `size` | `size="sm" \| "md" \| "lg"` |
| `highlight-current-row` | `highlightCurrentRow` + `v-model:current-row-key` |
| `show-overflow-tooltip` | `showOverflowTooltip` |
| `empty-text` | `emptyText` 或 `emptyMessage` |
| `max-height` | `maxHeight` 或 `tableHeight` |
| `#default` / column slot | `#item-{value}` |
| `data` | `items` |
| `columns` / `prop`+`label` | `headers` / `value`+`text` |

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `headers` | `TableHeader[]` | — | 列定义：`text` / `value` / `sortable` / `fixed` / `width` |
| `items` | `TableItem[]` | — | 行数据 |
| `itemsSelected` | `TableItem[] \| null` | `null` | 多选；配合 `selectionMode="multiple"` |
| `selectionMode` | `'multiple' \| 'single' \| null` | `null` | 选择列类型（`WiCheckbox` / `WiRadio`） |
| `selectedItem` | `TableItem \| null` | `null` | 单选行（`v-model:selected-item`） |
| `serverOptions` | `TableServerOptions \| null` | `null` | 服务端分页排序 |
| `rowsPerPage` | `number` | `25` | 每页条数 |
| `currentPage` | `number` | `1` | 当前页 |
| `sortBy` / `sortType` | — | `''` / `'asc'` | 客户端排序 |
| `filterOptions` | `TableFilterOption[]` | `null` | 结构化筛选 |
| `searchField` / `searchValue` | — | `''` | 搜索 |
| `alternating` | `boolean` | `false` | 斑马纹（`stripe` 别名） |
| `border` / `borderCell` | `boolean` | `false` | 边框网格 |
| `highlightCurrentRow` | `boolean` | `false` | 高亮当前行 |
| `showOverflowTooltip` | `boolean` | `false` | 溢出 Tooltip |
| `fit` | `boolean` | `true` | 列宽撑满表格 |
| `hideFooter` | `boolean` | `false` | 隐藏内置页脚 |
| `buttonsPagination` | `boolean` | `false` | 页码按钮分页 |
| `loading` / `emptyMessage` | — | — | 加载与空态 |
| `size` | `'sm' \| 'md' \| 'lg'` | — | 表格密度 |
| `rowKey` | `string` | `'id'` | 行唯一键字段 |
| `ariaLabel` | `string` | — | 表格无障碍名称 |
| `currentRowKey` | `string \| number \| null` | `null` | 当前行键（可 v-model） |

## Slots

| 插槽 | 说明 |
| --- | --- |
| `header-{value}` / `header` | 自定义表头 |
| `item-{value}` / `item` | 自定义单元格 |
| `expand` | 展开行内容 |
| `empty-message` / `loading` / `pagination` | 空态、加载、分页 |
| `body` / `body-prepend` / `body-append` | 完全自定义表体 |

## Events

| 事件 | 说明 |
| --- | --- |
| `clickRow` | 行单击/双击 |
| `updateSort` | 排序变化 |
| `update:itemsSelected` | 多选 v-model |
| `update:serverOptions` | 服务端选项 v-model |
| `update:currentRowKey` | 当前行 v-model |
| `currentChange` | 当前行变化（新行、旧行） |
| `expandRow` | 展开行 |
| `selectRow` / `deselectRow` / `selectAll` | 选择相关 |
