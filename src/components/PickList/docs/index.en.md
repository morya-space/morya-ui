---
title: PickList
category: 03 / DATA
description: Dual-list picker for moving items between lists.
---

# PickList

Move items between the source and target lists.

## Import

```ts
import { MPickList } from 'morya-ui'
```

## Basic

```vue preview src="./demos/Basic.en.vue"
```

## Custom items

```vue preview src="./demos/CustomItems.en.vue"
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `source` | `unknown[]` | `[]` | Source list. |
| `target` | `unknown[]` | `[]` | Target list. |
| `sourceHeader` | `string` | locale `sourceHeader` | Source header. |
| `targetHeader` | `string` | locale `targetHeader` | Target header. |
| `dataKey` | `string` | — | Unique key for object items. |
| `pt` | [RootPassThrough](/docs/types#RootPassThrough) `{ root? }` | — | Pass-through; see [Styling & attrs](/docs/attrs). |


## Events

| Event | Prop | Description |
| --- | --- | --- |
| `update:source` | `unknown[]` | Emitted when the source list changes. |
| `update:target` | `unknown[]` | Emitted when the target list changes. |

## Slots

| Slot | Prop | Description |
| --- | --- | --- |
| `item` | `{ item, index }` | Custom list item content. |
