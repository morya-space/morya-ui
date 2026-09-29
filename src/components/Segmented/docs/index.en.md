---
title: Segmented
category: 02 / FORM
description: Single-choice segmented control.
---

# Segmented

Switch between mutually exclusive modes or views. Unlike [SelectButton](/components/SelectButton), Segmented uses a track + raised thumb look and **single-select** `radiogroup` semantics (not `aria-pressed` toggles).

## Import

```ts
import { MSegmented } from 'morya-ui'
```

## Basic

`options` may be `string[]` or `{ label, value, icon?, disabled? }[]`.

```vue preview src="./demos/Basic.vue"
```

## Block and round shape

`block` stretches items evenly; `shape="round"` uses a pill track.

```vue preview src="./demos/BlockAndShape.vue"
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `string \| number` | — | Selected value |
| `options` | `string[] \| SegmentedOption[]` | — | Options |
| `size` | `'small' \| 'large' \| 'sm' \| 'md' \| 'lg'` | — | Size |
| `block` | `boolean` | `false` | Full width, equal segments |
| `disabled` | `boolean` | `false` | Disable the group |
| `shape` | `'default' \| 'round'` | `'default'` | Corner style |
| `label` | `string` | — | Accessible `radiogroup` label |
| `name` | `string` | auto | Native radio group `name` |
| `pt` | [RootPassThrough](/docs/types#RootPassThrough) | — | Root pass-through |

## Events

| Event | Payload | Description |
| --- | --- | --- |
| `update:modelValue` | same as `modelValue` | Selection changed |

## vs SelectButton

| | Segmented | SelectButton |
| --- | --- | --- |
| Look | Track + raised segment | Bordered button group |
| Multi | No | `multiple` |
| ARIA | `radiogroup` + `radio` | `group` + `aria-pressed` |
