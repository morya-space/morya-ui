---
title: InputNumber
category: 02 / FORM
description: Number input with optional steppers, min/max bounds, and sizes.
---

# InputNumber

Number input. Can show increment and decrement buttons, and constrain values with `min` / `max` / `step`.

## Import

```ts
import { MInputNumber } from 'morya-ui'
```

## Basic

```vue preview src="./demos/Basic.vue"
```

## Buttons

```vue preview src="./demos/Buttons.vue"
```

## Precision & placement

`precision` rounds to a number of decimal places. `button-placement="right"` puts both buttons on the right. `clearable` shows a clear control.

```vue preview src="./demos/PrecisionAndPlacement.vue"
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `number \| null` | `null` | Bound value. |
| `label` | `string` | — | Label text. |
| `min` | `number` | — | Minimum value. |
| `max` | `number` | — | Maximum value. |
| `step` | `number` | `1` | Step. |
| `precision` | `number` | — | Decimal places. |
| `showButtons` | `boolean` | `false` | Show increment and decrement buttons. |
| `buttonPlacement` | `'both' \| 'right'` | `'both'` | Button placement. |
| `clearable` | `boolean` | `false` | Show a clear control. |
| `size` | `'small' \| 'large' \| 'sm' \| 'md' \| 'lg'` | — | Size. |
| `fluid` | `boolean` | `false` | Full width. |
| `invalid` | `boolean` | `false` | Validation failed state. |
| `disabled` | `boolean` | `false` | Disabled. |
| `pt` | [FieldPassThrough](/docs/types#FieldPassThrough) `{ root?, label?, control?, input? }` | — | Pass-through; see [Styling & attrs](/docs/attrs). |


## Events

| Event | Prop | Description |
| --- | --- | --- |
| `update:modelValue` | `number \| null` | Value changed. |

## Methods

| Method | Description |
| --- | --- |
| `focus()` | Focus the underlying input. |
| `blur()` | Blur the underlying input. |
| `select()` | Select all text in the input. |

## Slots

| Slot | Description |
| --- | --- |
| `prefix` | Prefix. |
| `suffix` | Suffix. |
