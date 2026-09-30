---
title: Descriptions
category: 03 / DATA
description: Read-only field list with columns, borders, and horizontal/vertical layout.
---

# Descriptions

Detail panels and read-only drawers: label + content pairs.

## Import

```ts
import { MDescriptions, MDescriptionsItem } from 'morya-ui'
```

## Basic

`column` sets items per row; item `span` crosses columns.

```vue preview src="./demos/Basic.vue"
```

## Bordered & vertical

`bordered` draws cell borders; `layout="vertical"` stacks label above content.

```vue preview src="./demos/Bordered.vue"
```

## Props — Descriptions

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | `string` | — | Title |
| `bordered` | `boolean` | `false` | Borders |
| `column` | `number` | `3` | Columns per row |
| `layout` | `'horizontal' \| 'vertical'` | `'horizontal'` | Label layout |
| `size` | `DescriptionsSize` | — | Density |
| `colon` | `boolean` | `true` | Colon after label |
| `pt` | `RootPassThrough` | — | Pass-through |

## Props — DescriptionsItem

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` | — | Label |
| `span` | `number` | `1` | Column span |

## Slots

| Slot | Component | Description |
| --- | --- | --- |
| `default` | Descriptions | Items |
| `title` / `extra` | Descriptions | Title / trailing actions |
| `default` / `label` | Item | Content / label |
