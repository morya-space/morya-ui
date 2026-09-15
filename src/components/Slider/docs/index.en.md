---
title: Slider
category: 02 / FORM
description: Slider for a single value or a range.
---

# Slider

Drag to pick a number. In `range` mode there are two thumbs and the bound value is `[min, max]`.

## Import

```ts
import { MSlider } from 'morya-ui'
```

## Basic

```vue preview src="./demos/Basic.vue"
```

## Range

```vue preview src="./demos/Range.vue"
```

## Marks & vertical

`marks` can be a number array or a value-to-label map. `tooltip` shows the current value while dragging.

```vue preview src="./demos/MarksAndVertical.en.vue"
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `number \| number[]` | `0` | Bound value; a two-element array in range mode. |
| `min` | `number` | `0` | Minimum. |
| `max` | `number` | `100` | Maximum. |
| `step` | `number` | `1` | Step. |
| `range` | `boolean` | `false` | Range mode. |
| `marks` | `number[] \| Record<number, string>` | — | Tick marks; array of values, or a value-to-label map. |
| `tooltip` | `boolean` | `false` | Show the current value while dragging. |
| `vertical` | `boolean` | `false` | Vertical layout. |
| `disabled` | `boolean` | `false` | Disabled. |
| `pt` | [FieldPassThrough](/docs/types#FieldPassThrough) `{ root?, label?, control?, input? }` | — | Pass-through; see [Styling & attrs](/docs/attrs). |


## Events

| Event | Prop | Description |
| --- | --- | --- |
| `update:modelValue` | `number \| number[]` | Emitted when the value changes. |

## Slots

No slots.
