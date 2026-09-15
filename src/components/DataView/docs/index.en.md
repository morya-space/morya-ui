---
title: DataView
category: 03 / DATA
description: Display data in a list or grid layout, with optional pagination.
---

# DataView

Render a collection in list / grid layout, with optional pagination.

## Import

```ts
import { MDataView } from 'morya-ui'
```

## Basic

```vue preview src="./demos/Basic.vue"
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `any[]` | `[]` | Data. |
| `layout` | `'list' \| 'grid'` | `'list'` | Layout. |
| `paginator` | `boolean` | `false` | Enable pagination. |
| `rows` | `number` | `10` | Rows per page. |
| `pt` | [RootPassThrough](/docs/types#RootPassThrough) `{ root? }` | — | Pass-through; see [Styling & attrs](/docs/attrs). |


## Slots

| Slot | Description |
| --- | --- |
| `list` | List layout, `{ items }`. |
| `grid` | Grid layout, `{ items }`. |

## Events

This component does not emit custom events; pagination is handled by the built-in `MPagination`.
