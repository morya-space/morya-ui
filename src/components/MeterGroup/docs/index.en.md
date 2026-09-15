---
title: MeterGroup
category: 03 / DATA
description: Segmented meter for proportional values.
---

# MeterGroup

Displays multiple `{ label, value, color }` segments as a proportion of the total.

## Import

```ts
import { MMeterGroup } from 'morya-ui'
```

## Basic

```vue preview src="./demos/Basic.en.vue"
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `MeterGroupItem[]` | — | Segment data. |
| `max` | `number` | Sum of segments | Maximum total. |
| `pt` | [RootPassThrough](/docs/types#RootPassThrough) `{ root? }` | — | Pass-through; see [Styling & attrs](/docs/attrs). |


## Events

No custom events.

## Slots

| Slot | Description |
| --- | --- |
| `label` | Custom label `{ meter }`. |

## Types

<h4 id="MeterGroupItem">MeterGroupItem</h4>

See source `types.ts` for the full definition.

```ts
interface MeterGroupItem {
  label: string
  value: number
  color?: string
}
```
