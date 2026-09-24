---
title: Pagination
category: 03 / DATA
description: Pagination. v-model is the page number. The instance exposes first (zero-based index of the first record).
---

# Pagination

Pagination. `v-model` uses a **1-based page number**. The instance property `first` is the zero-based index of the first record on the page: `(page - 1) * rows`.

`pageSize` is an alias of `rows` (`pageSize` wins when both are set). Also supports `showSizePicker`, `showQuickJumper`, and `simple`.

## Import

```ts
import { MPagination } from 'morya-ui'
```

## Basic

```vue preview src="./demos/Basic.vue"
```

## Size picker / jumper / simple

```vue preview src="./demos/SizePickerJumperSimple.vue"
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `number` | `1` | Current page (1-based). |
| `totalRecords` | `number` | — | Total number of records. |
| `rows` | `number` | `10` | Rows per page. |
| `pageSize` | `number` | — | Alias of `rows`; `pageSize` wins when both are set. |
| `pageLinkSize` | `number` | `5` | Number of page link buttons. |
| `showSizePicker` | `boolean` | `false` | Show the page-size select. |
| `pageSizes` | `number[]` | `[10, 20, 50, 100]` | Options for `showSizePicker`. |
| `showQuickJumper` | `boolean` | `false` | Page select for jumping to a page. The menu can be filtered when there are more than 10 pages. |
| `simple` | `boolean` | `false` | Compact prev / current / next. |
| `disabled` | `boolean` | `false` | Disabled. |
| `pt` | [RootPassThrough](/docs/types#RootPassThrough) `{ root? }` | — | Pass-through; see [Styling & attrs](/docs/attrs). |


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
