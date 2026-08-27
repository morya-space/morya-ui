---
title: Pagination
category: 06 / DATA
description: 分页器，v-model 为页码；实例暴露 first（零基首条索引）。
---

# Pagination

分页导航，`v-model` 使用 **1-based 页码**；实例属性 `first` 对应零基首条记录索引 `(page - 1) * rows`。

对照 Naive：`pageSize` 是 `rows` 的别名（同时传入时 `pageSize` 优先）；`showSizePicker` / `showQuickJumper` / `simple` 对应 `n-pagination` 的常用能力。

## 引入

```ts
import { WiPagination } from '@well-insight/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { WiPagination } from '@well-insight/ui'
import { ref } from 'vue'

const page = ref(1)
</script>

<template>
  <div style="display:grid;gap:0.75rem">
    <WiPagination v-model="page" :total-records="95" :rows="10" :page-link-size="5" />
    <p style="margin:0;color:var(--wi-color-text-muted);font-size:0.875rem">
      Page {{ page }} · first ≈ {{ (page - 1) * 10 }}
    </p>
  </div>
</template>
```

## Size picker / jumper / simple

```vue preview
<script setup lang="ts">
import { WiPagination } from '@well-insight/ui'
import { ref } from 'vue'

const page = ref(1)
const pageSize = ref(10)
</script>

<template>
  <div style="display:grid;gap:1rem">
    <WiPagination
      v-model="page"
      v-model:page-size="pageSize"
      :total-records="200"
      show-size-picker
      :page-sizes="[10, 20, 50]"
      show-quick-jumper
    />
    <WiPagination v-model="page" :total-records="200" :page-size="pageSize" simple />
  </div>
</template>
```

## Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `number` | `1` | 当前页（从 1 开始）。 |
| `totalRecords` | `number` | — | 总记录数。 |
| `rows` | `number` | `10` | 每页条数。 |
| `pageSize` | `number` | — | `rows` 的别名（Naive `page-size`）；两者同时传入时以 `pageSize` 为准。 |
| `pageLinkSize` | `number` | `5` | 页码按钮数量。 |
| `showSizePicker` | `boolean` | `false` | 显示每页条数选择器。 |
| `pageSizes` | `number[]` | `[10, 20, 50, 100]` | `showSizePicker` 的选项。 |
| `showQuickJumper` | `boolean` | `false` | 显示跳转到指定页。 |
| `simple` | `boolean` | `false` | 精简为上一页 / 当前页 / 下一页。 |
| `disabled` | `boolean` | `false` | 禁用。 |

## Events

| 事件名 | 参数 | 说明 |
| --- | --- | --- |
| `update:modelValue` | `number` | 页码变化。 |
| `page` | `number` | 页码变化（同值）。 |
| `update:rows` / `update:pageSize` | `number` | 每页条数变化（同值）。 |

## Instance

| 方法 / 属性 | 说明 |
| --- | --- |
| `first` | 当前页首条记录的零基索引：`(page - 1) * rows`。 |
| `pageCount` | 总页数。 |
