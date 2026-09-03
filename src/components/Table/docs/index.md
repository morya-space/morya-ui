---
title: Table
category: 03 / DATA
description: 数据表格。支持排序、筛选、选择、分页、固定列与空/加载态。列宽支持 width / minWidth / fit。
---

# Table

`WiTable` 用于展示结构化行数据。通过 `columns` 定义列、`rows` 传入数据；内置客户端排序、筛选、分页与行选择，也支持服务端分页模式。

列宽规则：

- 设置了 `width` 的列为固定宽度
- 未设 `width` 的列以 `minWidth`（默认 `80`）为弹性下限；`fit` 为 `true`（默认）时，剩余宽度按比例分配给弹性列
- 总最小宽度超出容器时出现横向滚动

## 引入

```ts
import { WiTable, WiTag } from '@well-insight/ui'
import type { TableColumnDefinition, TableItem } from '@well-insight/ui'
```

## 基础用法

```vue preview
<script setup lang="ts">
import { WiTable, WiTag } from '@well-insight/ui'

const columns = [
  { key: 'name', label: '项目', minWidth: 140, sortable: true },
  { key: 'status', label: '状态', width: 120 },
  { key: 'owner', label: '负责人', minWidth: 100 },
  { key: 'team', label: '团队', minWidth: 120 },
  { key: 'progress', label: '进度', width: 100, align: 'end' as const },
]
const rows = [
  { id: 1, name: 'Landing Redesign', status: 'Published', owner: 'Ada', team: 'Design', progress: '100%' },
  { id: 2, name: 'Dashboard v2', status: 'Draft', owner: 'Lin', team: 'Frontend', progress: '62%' },
  { id: 3, name: 'Auth Gateway', status: 'Review', owner: 'Kai', team: 'Backend', progress: '88%' },
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

## 行选择

多选配合 `selection-mode="multiple"` 与 `v-model:selection`；单选使用 `selection-mode="single"` 与 `v-model:selected-item`。

```vue preview
<script setup lang="ts">
import { WiTable } from '@well-insight/ui'
import { ref } from 'vue'

const columns = [
  { key: 'name', label: '姓名', minWidth: 120 },
  { key: 'role', label: '角色', minWidth: 120 },
]
const rows = [
  { id: 1, name: 'Ada', role: 'Designer' },
  { id: 2, name: 'Lin', role: 'Engineer' },
]
const selection = ref<Record<string, unknown>[]>([])
</script>

<template>
  <WiTable
    v-model:selection="selection"
    :columns="columns"
    :rows="rows"
    selection-mode="multiple"
    highlight-current
    :paginator="false"
  />
</template>
```

## 筛选与分页

客户端筛选可通过 `search-value` / `filter-options`；分页开启 `paginator` 并配合 `v-model:page` 与 `rows-per-page`。

```vue preview
<script setup lang="ts">
import { WiTable } from '@well-insight/ui'
import { ref } from 'vue'

const columns = [
  { key: 'name', label: '姓名', sortable: true, minWidth: 120 },
  { key: 'role', label: '角色', minWidth: 120 },
  { key: 'email', label: '邮箱', minWidth: 180 },
]
const rows = [
  { id: 1, name: 'Ada', role: 'Designer', email: 'ada@well.design' },
  { id: 2, name: 'Lin', role: 'Engineer', email: 'lin@well.design' },
  { id: 3, name: 'Kai', role: 'Engineer', email: 'kai@well.design' },
  { id: 4, name: 'Mia', role: 'Designer', email: 'mia@well.design' },
  { id: 5, name: 'Neo', role: 'Engineer', email: 'neo@well.design' },
]
const page = ref(1)
</script>

<template>
  <WiTable
    v-model:page="page"
    :columns="columns"
    :rows="rows"
    paginator
    :rows-per-page="3"
  />
</template>
```

## 固定列

列定义中设置 `fixed: 'left'` 可冻结左侧列（当前批次支持左固定）。

```vue preview
<script setup lang="ts">
import { WiTable } from '@well-insight/ui'

const columns = [
  { key: 'name', label: '姓名', width: 120, fixed: 'left' as const },
  { key: 'q1', label: 'Q1 营收', width: 140 },
  { key: 'q2', label: 'Q2 营收', width: 140 },
  { key: 'q3', label: 'Q3 营收', width: 140 },
  { key: 'action', label: '操作', width: 100 },
]
const rows = [
  { id: 1, name: 'Ada', q1: '12.4万', q2: '13.1万', q3: '14.0万', action: '编辑' },
  { id: 2, name: 'Lin', q1: '9.8万', q2: '10.2万', q3: '11.5万', action: '编辑' },
]
</script>

<template>
  <WiTable :columns="columns" :rows="rows" bordered :paginator="false" />
</template>
```

## 展开行与列渲染

列可通过 `render` 函数渲染；展开行设置 `expandable`，详情内容由插槽 `expansion` 提供。`cell-{key}` 插槽优先于 `render`。

```vue preview
<script setup lang="ts">
import { WiTable } from '@well-insight/ui'

const columns = [
  { key: 'name', label: '姓名', render: (row: { name: string }) => `*${row.name}*` },
  { key: 'role', label: '角色' },
]
const rows = [
  { id: 1, name: 'Ada', role: 'Designer', extra: 'Design system' },
]
</script>

<template>
  <WiTable :columns="columns" :rows="rows" expandable bordered :paginator="false">
    <template #expansion="{ row }">
      {{ row.extra }}
    </template>
  </WiTable>
</template>
```

## 空态与加载

```vue preview
<script setup lang="ts">
import { WiButton, WiTable } from '@well-insight/ui'
import { ref } from 'vue'

const loading = ref(false)
const columns = [
  { key: 'name', label: '姓名', minWidth: 120 },
  { key: 'role', label: '角色', minWidth: 120 },
]
</script>

<template>
  <div style="display:grid;gap:0.75rem">
    <WiButton :label="loading ? '结束加载' : '开始加载'" @click="loading = !loading" />
    <WiTable
      :columns="columns"
      :rows="[]"
      :loading="loading"
      empty-text="还没有数据"
      empty-description="创建第一条记录后会显示在这里"
      :paginator="false"
    />
  </div>
</template>
```

## 服务端模式

传入 `server-options` 与 `server-items-length`，通过 `v-model:server-options` 同步页码、每页条数与排序字段。

```vue preview
<script setup lang="ts">
import { WiTable } from '@well-insight/ui'
import { ref } from 'vue'

const columns = [
  { key: 'name', label: '项目', sortable: true, minWidth: 140 },
  { key: 'owner', label: '负责人', minWidth: 100 },
]
const rows = ref([
  { id: 1, name: 'Landing', owner: 'Ada' },
  { id: 2, name: 'Dashboard', owner: 'Lin' },
])
const serverOptions = ref({ page: 1, rowsPerPage: 10, sortBy: 'name', sortType: 'asc' as const })
const total = ref(42)
</script>

<template>
  <WiTable
    v-model:server-options="serverOptions"
    :columns="columns"
    :rows="rows"
    :server-items-length="total"
    :loading="false"
  />
</template>
```

## TableColumnDefinition

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `key` | `string` | 列字段名（绑定行数据的键）。 |
| `label` | `string` | 列头文案。 |
| `width` | `number` | 固定列宽（px）。 |
| `minWidth` | `number` | 弹性列最小宽度，默认 `80`。 |
| `sortable` | `boolean` | 是否可排序。 |
| `fixed` | `boolean \| 'left' \| 'right'` | 固定列；当前实现左固定。 |
| `align` | `'start' \| 'center' \| 'end'` | 单元格对齐。 |
| `render` | `(row) => unknown` | 自定义单元格渲染。 |
| `showOverflowTooltip` | `boolean` | 该列文本溢出时显示 Tooltip。 |

## Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `columns` | `TableColumnDefinition[]` | — | 列定义。 |
| `rows` | `TableItem[]` | — | 行数据。 |
| `fit` | `boolean` | `true` | 弹性列是否撑满表格宽度。 |
| `selectionMode` | `'single' \| 'multiple' \| null` | `null` | 行选择模式。 |
| `selection` | `TableItem[] \| null` | `null` | 多选绑定（`v-model:selection`）。 |
| `selectedItem` | `TableItem \| null` | `null` | 单选绑定（`v-model:selected-item`）。 |
| `serverOptions` | `TableServerOptions \| null` | `null` | 服务端分页/排序选项。 |
| `serverItemsLength` | `number` | `0` | 服务端总条数。 |
| `paginator` | `boolean` | `false` | 显示内置分页页脚。 |
| `page` | `number` | `1` | 当前页（`v-model:page`）。 |
| `rowsPerPage` | `number` | `25` | 每页条数。 |
| `expandable` | `boolean` | `false` | 显示展开列（也可由 `#expansion` 插槽隐式启用）。 |
| `striped` | `boolean` | `false` | 斑马纹行。 |
| `bordered` | `boolean` | `false` | 单元格边框。 |
| `highlightCurrent` | `boolean` | `false` | 高亮当前行，配合 `v-model:current-row-key`。 |
| `rowHover` | `boolean` | `true` | 行 hover 高亮。 |
| `sortField` / `sortOrder` | — | — | 受控排序字段与方向。 |
| `sortMode` | `'client' \| 'emit'` | `'client'` | 客户端排序或仅抛出排序事件。 |
| `searchField` / `searchValue` | — | — | 客户端搜索。 |
| `filterOptions` | `TableFilterOption[]` | `null` | 结构化筛选条件。 |
| `loading` | `boolean` | `false` | 加载中。 |
| `emptyText` | `string` | — | 空数据文案。 |
| `emptyDescription` | `string` | — | 空数据补充说明。 |
| `maxHeight` | `number \| null` | `null` | 表格最大高度，超出滚动。 |
| `showOverflowTooltip` | `boolean` | `false` | 全局单元格溢出 Tooltip。 |
| `rowKey` | `string` | `'id'` | 行唯一键字段。 |
| `size` | `'sm' \| 'md' \| 'lg'` | — | 表格密度。 |
| `ariaLabel` | `string` | — | — |
| `bodyExpandRowClassName` | `TableBodyRowClassName` | — | — |
| `bodyItemClassName` | `TableBodyItemClassName` | — | — |
| `bodyRowClassName` | `TableBodyRowClassName` | — | — |
| `bodyTextDirection` | `TableTextDirection` | — | — |
| `checkboxColumnWidth` | `number \| null` | — | — |
| `clickEventType` | `TableClickEventType` | — | — |
| `clickRowToExpand` | `boolean` | — | — |
| `currentRowKey` | `string \| number \| null` | — | — |
| `expandColumnWidth` | `number` | — | — |
| `expandedRowKeys` | `Array<string \| number>` | — | — |
| `filters` | `Record<string, unknown> \| null` | — | — |
| `fixedCheckbox` | `boolean` | — | — |
| `fixedExpand` | `boolean` | — | — |
| `fixedHeader` | `boolean` | — | — |
| `fixedIndex` | `boolean` | — | — |
| `headerClassName` | `string` | — | — |
| `headerItemClassName` | `TableHeaderItemClassName` | — | — |
| `headerTextDirection` | `TableTextDirection` | — | — |
| `hideHeader` | `boolean` | — | — |
| `hideRowsPerPage` | `boolean` | — | — |
| `indexColumnWidth` | `number` | — | — |
| `multiSort` | `boolean` | — | — |
| `mustSort` | `boolean` | — | — |
| `preventContextMenuRow` | `boolean` | — | — |
| `rowsItems` | `number[]` | — | — |
| `rowsOfPageSeparatorMessage` | `string` | — | — |
| `rowsPerPageMessage` | `string` | — | — |
| `showHeader` | `boolean` | — | — |
| `showIndex` | `boolean` | — | — |
| `showIndexSymbol` | `string` | — | — |
| `tableClassName` | `string` | — | — |
| `tableHeight` | `number \| null` | — | — |
| `tableMinHeight` | `number` | — | — |
| `tableNodeId` | `string` | — | — |

## Slots

| 插槽 | 说明 |
| --- | --- |
| `cell-{key}` | 列 `{key}` 单元格，作用域 `{ row, value, column }`。 |
| `body-cell` | 任意单元格，作用域 `{ row, column, value }`。 |
| `expansion` | 展开行内容，作用域 `{ row }`。 |
| `empty` | 自定义空态。 |
| `loading` | 自定义加载态。 |
| `pagination` | 自定义分页区域。 |
| `body` | 自定义 `body` 内容。 |
| `body-append` | 自定义 `body-append` 内容。 |
| `body-prepend` | 自定义 `body-prepend` 内容。 |
| `customize-headers` | 自定义 `customize-headers` 内容。 |
| `header` | 自定义 `header` 内容。 |
| `header-*` | 动态插槽（前缀 `header-`）。 |

## Events

| 事件名 | 参数 | 说明 |
| --- | --- | --- |
| `sort` | `{ sortField?, sortOrder? }` | 排序变化。 |
| `page` | `number` | 页码变化。 |
| `row-click` | `{ row, index }` | 行单击。 |
| `current-change` | `row \| null, oldRow \| null` | 当前高亮行变化。 |
| `expand` | `{ row, expanded }` | 行展开。 |
| `update:selection` | `TableItem[]` | 多选 v-model。 |
| `update:page` | `number` | 页码 v-model。 |
| `update:server-options` | `TableServerOptions` | 服务端选项 v-model。 |
| `update:current-row-key` | `string \| number \| null` | 当前行键 v-model。 |
| `contextmenuRow` | — | — |
| `deselectRow` | — | — |
| `filter` | — | — |
| `selectAll` | — | — |
| `selectRow` | — | — |
| `update:expandedRowKeys` | — | — |
| `update:filters` | — | — |
| `update:selectedItem` | — | — |
| `updatePageItems` | — | — |
| `updateTotalItems` | — | — |

## 实例方法

通过 `ref` 可访问分页控制：`nextPage`、`prevPage`、`updatePage`、`currentPaginationNumber`、`maxPaginationNumber` 等。
