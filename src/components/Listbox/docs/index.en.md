---
title: Listbox
category: 02 / FORM
description: List-based single or multiple selection with optional filtering.
---

# Listbox

Present options as a list with single selection, multiple selection, and filtering.

## Import

```ts
import { MListbox } from 'morya-ui'
```

## Basic

```vue preview src="./demos/Basic.vue"
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `string \| number \| Array` | — | Bound value. |
| `options` | `{ label, value, disabled? }[]` | — | Options. |
| `multiple` | `boolean` | `false` | Multiple selection. |
| `filter` | `boolean` | `false` | Show filter box. |
| `listStyle` | `string` | — | Inline styles for the list. |
| `virtual` | `boolean` | auto | `true` forces virtualization; `false` disables; auto-on at 80+ options. |
| `disabled` | `boolean` | `false` | Disabled. |
| `pt` | [FieldPassThrough](/docs/types#FieldPassThrough) `{ root?, label?, control?, input? }` | — | Pass-through; see [Styling & attrs](/docs/attrs). |


## Events

| Event | Prop | Description |
| --- | --- | --- |
| `update:modelValue` | same as `modelValue` | Value changed. |

## Slots

| Slot | Description |
| --- | --- |
| `option` | Option `{ option }`. |
