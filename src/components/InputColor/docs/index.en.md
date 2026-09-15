---
title: InputColor
category: 02 / FORM
description: Color picker with a palette and hexadecimal text input.
---

# InputColor

Edit hex colors with the native color picker and a text field.

## Import

```ts
import { MInputColor } from 'morya-ui'
```

## Basic

```vue preview src="./demos/Basic.vue"
```

## Swatches

`swatches` provides a row of preset colors.

```vue preview src="./demos/Swatches.vue"
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `string` | `'#000000'` | Hexadecimal color. |
| `swatches` | `string[]` | — | Preset color chips. |
| `disabled` | `boolean` | `false` | Disabled. |
| `id` | `string` | — | Color input id. |
| `pt` | [FieldPassThrough](/docs/types#FieldPassThrough) `{ root?, label?, control?, input? }` | — | Pass-through; see [Styling & attrs](/docs/attrs). |


## Events

| Event | Prop | Description |
| --- | --- | --- |
| `update:modelValue` | `string` | Color changed. |

## Slots

| Slot | Description |
| --- | --- |
| `trigger` | Custom color trigger. |
