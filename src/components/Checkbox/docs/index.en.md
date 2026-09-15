---
title: Checkbox
category: 02 / FORM
description: Checkbox. Boolean modelValue; supports invalid.
---

# Checkbox

Binary checkbox.

## Import

```ts
import { MCheckbox } from 'morya-ui'
```

## Basic

```vue preview src="./demos/Basic.vue"
```

## Invalid

```vue preview src="./demos/Invalid.vue"
```

## Disabled

```vue preview src="./demos/Disabled.vue"
```

## Group

`MCheckboxGroup` uses an array `v-model`. Children identify themselves with `value`. `indeterminate` is a mixed visual.

```vue preview src="./demos/Group.vue"
```

## Styling & attrs

Fallthrough attrs except input **events** (`@change`, …) bind to the visible `<label>` root. Prefer `name` / `value` as props; use `pt.root` / `pt.input` for inner DOM. See [Styling & attrs](/docs/attrs).

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `boolean` | `false` | Binary checked state. |
| `label` | `string` | — | Label text; default slot also works. |
| `id` | `string` | — | Native id. |
| `name` | `string` | — | Native name. |
| `value` | `string \| number \| boolean` | — | Option value inside a group. |
| `indeterminate` | `boolean` | `false` | Mixed state. |
| `size` | `'small' \| 'large' \| 'sm' \| 'md' \| 'lg'` | — | Size. |
| `invalid` | `boolean` | `false` | Invalid validation state. |
| `disabled` | `boolean` | `false` | Disabled. |
| `required` | `boolean` | `false` | Native required. |
| `pt` | [ControlPassThrough](/docs/types#ControlPassThrough) `{ root?, input? }` | — | `root` (label), `input`. |

## Events

| Event | Prop | Description |
| --- | --- | --- |
| `update:modelValue` | `boolean` | Checked state change. |

## Slots

| Slot | Description |
| --- | --- |
| `default` | Custom label; takes precedence over `label`. |
