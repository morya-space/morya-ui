---
title: Pagination
category: 03 / DATA
description: Pagination. v-model is the page number. The instance exposes first (zero-based index of the first record).
---

# Pagination

Pagination. `v-model` uses a **1-based page number**. The instance property `first` is the zero-based index of the first record on the page: `(page - 1) * rows`.

Naive mapping: `pageSize` is an alias of `rows` (`pageSize` wins when both are set). `showSizePicker` / `showQuickJumper` / `simple` cover the common `n-pagination` subset.

## Import

```ts
import { WdPagination } from '@wex-design/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { WdPagination } from '@wex-design/ui'
import { ref } from 'vue'

const page = ref(1)
</script>

<template>
  <div style="display:grid;gap:0.75rem">
    <WdPagination v-model="page" :total-records="95" :rows="10" :page-link-size="5" />
    <p style="margin:0;color:var(--wd-color-text-muted);font-size:0.875rem">
      Page {{ page }} · first ≈ {{ (page - 1) * 10 }}
    </p>
  </div>
</template>
```

## Size picker / jumper / simple

```vue preview
<script setup lang="ts">
import { WdPagination } from '@wex-design/ui'
import { ref } from 'vue'

const page = ref(1)
const pageSize = ref(10)
</script>

<template>
  <div style="display:grid;gap:1rem">
    <WdPagination
      v-model="page"
      v-model:page-size="pageSize"
      :total-records="200"
      show-size-picker
      :page-sizes="[10, 20, 50]"
      show-quick-jumper
    />
    <WdPagination v-model="page" :total-records="200" :page-size="pageSize" simple />
  </div>
</template>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `number` | `1` | Current page (1-based). |
| `totalRecords` | `number` | — | Total number of records. |
| `rows` | `number` | `10` | Rows per page. |
| `pageSize` | `number` | — | Alias of `rows` (Naive `page-size`); `pageSize` wins when both are set. |
| `pageLinkSize` | `number` | `5` | Number of page link buttons. |
| `showSizePicker` | `boolean` | `false` | Show the page-size select. |
| `pageSizes` | `number[]` | `[10, 20, 50, 100]` | Options for `showSizePicker`. |
| `showQuickJumper` | `boolean` | `false` | Jump-to-page input. |
| `simple` | `boolean` | `false` | Compact prev / current / next. |
| `disabled` | `boolean` | `false` | Disabled. |

## Events

| Event | Prop | Description |
| --- | --- | --- |
| `update:modelValue` | `number` | Emitted when the page changes. |
| `page` | `number` | Emitted when the page changes (same value). |
| `update:rows` / `update:pageSize` | `number` | Emitted when page size changes (same value). |

## Instance

| Method / Property | Description |
| --- | --- |
| `first` | Zero-based index of the first record on the current page: `(page - 1) * rows`. |
| `pageCount` | Total number of pages. |

## Slots

No slots.
