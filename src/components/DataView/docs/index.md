---
title: DataView
category: 03 / DATA
description: 列表或网格布局展示数据，可分页。
---

# DataView

以 list / grid 布局渲染集合，可选分页。

## 引入

```ts
import { WiDataView } from '@well-insight/ui'
```

## 基础用法

```vue preview
<script setup lang="ts">
import { WiDataView } from '@well-insight/ui'

const items = ['Alpha', 'Bravo', 'Charlie', 'Delta', 'Echo', 'Foxtrot']
</script>

<template>
  <WiDataView :value="items" layout="grid" paginator :rows="4">
    <template #grid="{ items: page }">
      <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px">
        <div v-for="item in page" :key="item">
          {{ item }}
        </div>
      </div>
    </template>
  </WiDataView>
</template>
```

## Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `value` | `any[]` | `[]` | 数据。 |
| `layout` | `'list' \| 'grid'` | `'list'` | 布局。 |
| `paginator` | `boolean` | `false` | 启用分页。 |
| `rows` | `number` | `10` | 每页条数。 |
| `disabled` | `boolean` | — | — |
| `emptyMessage` | `string` | — | — |
| `loading` | `boolean` | — | — |
| `page` | `number` | — | — |
| `pageSizes` | `number[]` | — | — |
| `showSizePicker` | `boolean` | — | — |

## Slots

| 插槽 | 说明 |
| --- | --- |
| `list` | 列表布局，`{ items }`。 |
| `grid` | 网格布局，`{ items }`。 |
| `empty` | 自定义 `empty` 内容。 |
| `header` | 自定义 `header` 内容。 |
| `loading` | 自定义 `loading` 内容。 |

## Events

| 事件名 | 参数 | 说明 |
| --- | --- | --- |
| `update:page` | — | — |

本组件无自定义事件；分页交互由内置 `WiPagination` 处理。
