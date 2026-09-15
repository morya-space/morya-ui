---
title: SelectButton
category: 02 / FORM
description: Single or multiple selection presented as a button group.
---

# SelectButton

Present options as a button group, with single and multiple selection.

## Import

```ts
import { MSelectButton } from 'morya-ui'
```

## Basic

```vue preview src="./demos/Basic.vue"
```

## Multiple

```vue preview src="./demos/Multiple.vue"
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `string \| number \| boolean \| Array` | — | Bound value. |
| `options` | `{ label, value, disabled? }[]` | — | Option list. |
| `multiple` | `boolean` | `false` | Multiple selection. |
| `size` | `'small' \| 'large' \| 'sm' \| 'md' \| 'lg'` | — | Size. |
| `invalid` | `boolean` | `false` | Invalid (validation failed) state. |
| `disabled` | `boolean` | `false` | Disable the entire group. |
| `pt` | [RootPassThrough](/docs/types#RootPassThrough) `{ root? }` | — | Pass-through; see [Styling & attrs](/docs/attrs). |


## Events

| Event | Prop | Description |
| --- | --- | --- |
| `update:modelValue` | Same as `modelValue` | Emitted when the value changes. |

## Slots

No slots.
