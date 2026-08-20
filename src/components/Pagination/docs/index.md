---
title: Pagination
category: 06 / DATA
description: 分页器，v-model 为页码；实例暴露 first（零基首条索引）。
---

# Pagination

分页导航，`v-model` 使用 **1-based 页码**；实例属性 `first` 对应零基首条记录索引 `(page - 1) * rows`。

## 引入

```ts
import { WiPagination } from '@well-insight/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { ref } from 'vue'
import { WiPagination } from '@well-insight/ui'

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

## Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `number` | `1` | 当前页（从 1 开始）。 |
| `totalRecords` | `number` | — | 总记录数。 |
| `rows` | `number` | `10` | 每页条数。 |
| `pageLinkSize` | `number` | `5` | 页码按钮数量。 |
| `disabled` | `boolean` | `false` | 禁用。 |

## Events

| 事件名 | 参数 | 说明 |
| --- | --- | --- |
| `update:modelValue` | `number` | 页码变化。 |
| `page` | `number` | 页码变化（同值）。 |

## Instance

| 方法 / 属性 | 说明 |
| --- | --- |
| `first` | 当前页首条记录的零基索引：`(page - 1) * rows`。 |
| `pageCount` | 总页数。 |
