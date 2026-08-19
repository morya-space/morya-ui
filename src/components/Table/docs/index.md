---
title: Table
category: 06 / DATA
description: 数据表格。支持排序、筛选、选择、分页、固定列与空/加载态。列宽支持 width / minWidth / fit。
---

# Table

数据表格。列宽逻辑：

- 设置了 `width` 的列固定宽度
- 未设 `width` 的列按 `minWidth`（默认 `80`）作为弹性列，在 `fit`（默认 `true`）时按比例分配剩余宽度
- 总最小宽度超过容器时出现横向滚动

## 引入

```ts
import { WdTable, WdTag } from '@well-insight/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { WdTable, WdTag } from '@well-insight/ui'

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
  { id: 4, name: 'Billing Export', status: 'Published', owner: 'Mia', team: 'Platform', progress: '100%' },
  { id: 5, name: 'Mobile Shell', status: 'Draft', owner: 'Neo', team: 'Mobile', progress: '35%' },
  { id: 6, name: 'Search Index', status: 'Published', owner: 'Ada', team: 'Data', progress: '100%' },
  { id: 7, name: 'Notification Hub', status: 'Review', owner: 'Lin', team: 'Backend', progress: '74%' },
  { id: 8, name: 'Design Tokens', status: 'Draft', owner: 'Kai', team: 'Design', progress: '51%' },
]
</script>

<template>
  <WdTable :columns="columns" :rows="rows" striped bordered>
    <template #cell-status="{ value }">
      <WdTag
        :value="String(value)"
        :severity="value === 'Published' ? 'success' : value === 'Review' ? 'warn' : 'secondary'"
      />
    </template>
  </WdTable>
</template>
```

## Selection

```vue preview
<script setup lang="ts">
import { ref } from 'vue'
import { WdTable } from '@well-insight/ui'

const columns = [
  { key: 'name', label: '姓名', minWidth: 120 },
  { key: 'role', label: '角色', minWidth: 120 },
  { key: 'dept', label: '部门', minWidth: 120 },
  { key: 'city', label: '城市', minWidth: 100 },
  { key: 'level', label: '级别', width: 90 },
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
  <WdTable
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
import { ref } from 'vue'
import { WdTable } from '@well-insight/ui'

const columns = [
  { key: 'name', label: '姓名', filterable: true, sortable: true, minWidth: 120 },
  {
    key: 'role',
    label: '角色',
    filterable: true,
    minWidth: 120,
    filters: [
      { label: 'Engineer', value: 'Engineer' },
      { label: 'Designer', value: 'Designer' },
      { label: 'PM', value: 'PM' },
      { label: 'QA', value: 'QA' },
    ],
  },
  { key: 'dept', label: '部门', minWidth: 120, sortable: true },
  { key: 'email', label: '邮箱', minWidth: 180 },
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
  <WdTable
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
import { WdTable } from '@well-insight/ui'

const columns = [
  { key: 'name', label: '姓名', width: 120, fixed: 'left' as const },
  { key: 'q1', label: 'Q1 营收', width: 140 },
  { key: 'q2', label: 'Q2 营收', width: 140 },
  { key: 'q3', label: 'Q3 营收', width: 140 },
  { key: 'q4', label: 'Q4 营收', width: 140 },
  { key: 'yoy', label: '同比', width: 100 },
  { key: 'action', label: '操作', width: 100, fixed: 'right' as const },
]
const rows = [
  { id: 1, name: 'Ada', q1: '12.4万', q2: '13.1万', q3: '14.0万', q4: '15.2万', yoy: '+18%', action: '编辑' },
  { id: 2, name: 'Lin', q1: '9.8万', q2: '10.2万', q3: '11.5万', q4: '12.0万', yoy: '+12%', action: '编辑' },
  { id: 3, name: 'Kai', q1: '15.0万', q2: '14.6万', q3: '16.1万', q4: '17.3万', yoy: '+9%', action: '编辑' },
  { id: 4, name: 'Mia', q1: '8.2万', q2: '8.9万', q3: '9.4万', q4: '10.1万', yoy: '+21%', action: '编辑' },
  { id: 5, name: 'Neo', q1: '11.3万', q2: '11.0万', q3: '12.2万', q4: '13.5万', yoy: '+7%', action: '编辑' },
  { id: 6, name: 'Zoe', q1: '10.5万', q2: '11.8万', q3: '12.4万', q4: '13.0万', yoy: '+15%', action: '编辑' },
]
</script>

<template>
  <WdTable :columns="columns" :rows="rows" bordered />
</template>
```

## Empty / Loading

```vue preview
<script setup lang="ts">
import { ref } from 'vue'
import { WdButton, WdTable } from '@well-insight/ui'

const loading = ref(false)
const columns = [
  { key: 'name', label: '姓名', minWidth: 120 },
  { key: 'role', label: '角色', minWidth: 120 },
  { key: 'dept', label: '部门', minWidth: 120 },
]
</script>

<template>
  <div style="display:grid;gap:0.75rem">
    <WdButton :label="loading ? '结束加载' : '开始加载'" @click="loading = !loading" />
    <WdTable
      :columns="columns"
      :rows="[]"
      :loading="loading"
      empty-text="还没有数据"
      empty-description="创建第一条记录后会显示在这里"
    />
  </div>
</template>
```

## Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `columns` | `TableColumn[]` | — | 列定义：`width` 固定；`minWidth` 弹性下限（默认 80）。 |
| `fit` | `boolean` | `true` | 弹性列是否按比例分配剩余宽度。 |
| `rows` | `Record[]` | — | 行数据。 |
| `selectionMode` | `'single' \| 'multiple'` | — | 行选择。 |
| `selection` | — | — | `v-model:selection`。 |
| `filters` | `Record` | `{}` | `v-model:filters`。 |
| `paginator` | `boolean` | `false` | 内置分页。 |
| `rowsPerPage` / `page` | — | `10` / `1` | 分页。 |
| `striped` / `bordered` / `highlightCurrent` / `rowHover` | `boolean` | — | 外观。 |
| `sortMode` | `'client' \| 'emit'` | `'client'` | 本地排序或仅抛事件。 |
| `sortField` / `sortOrder` | — | — | 受控排序。 |
| `loading` / `emptyText` / `emptyDescription` / `size` | — | — | 同前。 |

## Slots / Events

| 插槽 | 说明 |
| --- | --- |
| `cell-{key}` / `empty` / `loading` | 同前。 |

| 事件 | 说明 |
| --- | --- |
| `sort` / `filter` / `page` / `row-click` / `current-change` | 交互回调。 |
