---
title: Pagination
category: 06 / DATA
description: Pagination. v-model is the page number. The instance exposes first (zero-based index of the first record).
---

# Pagination

Pagination. `v-model` uses a **1-based page number**. The instance property `first` is the zero-based index of the first record on the page: `(page - 1) * rows`.

## Import

```ts
import { WdPagination } from '@well-insight/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { ref } from 'vue'
import { WdPagination } from '@well-insight/ui'

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

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `number` | `1` | Current page (1-based). |
| `totalRecords` | `number` | — | Total number of records. |
| `rows` | `number` | `10` | Rows per page. |
| `pageLinkSize` | `number` | `5` | Number of page link buttons. |
| `disabled` | `boolean` | `false` | Disabled. |

## Events

| Event | Prop | Description |
| --- | --- | --- |
| `update:modelValue` | `number` | Emitted when the page changes. |
| `page` | `number` | Emitted when the page changes (same value). |

## Instance

| Method / Property | Description |
| --- | --- |
| `first` | Zero-based index of the first record on the current page: `(page - 1) * rows`. |
| `pageCount` | Total number of pages. |
